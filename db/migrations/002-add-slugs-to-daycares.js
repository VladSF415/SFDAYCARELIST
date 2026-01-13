// Migration to add slugs to all existing daycares
import db from '../index.js';

// Function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

async function addSlugs() {
  try {
    console.log('🔄 Starting slug migration...');

    // Get all daycares without slugs
    const result = await db.query(
      'SELECT id, name, slug FROM daycares WHERE slug IS NULL OR slug = \'\''
    );

    console.log(`📋 Found ${result.rows.length} daycares without slugs`);

    let updated = 0;
    let errors = 0;

    for (const daycare of result.rows) {
      try {
        let slug = generateSlug(daycare.name);
        let slugSuffix = 0;

        // Check if slug already exists and make it unique
        while (true) {
          const testSlug = slugSuffix === 0 ? slug : `${slug}-${slugSuffix}`;
          const existing = await db.query(
            'SELECT id FROM daycares WHERE slug = $1 AND id != $2',
            [testSlug, daycare.id]
          );

          if (existing.rows.length === 0) {
            slug = testSlug;
            break;
          }
          slugSuffix++;
        }

        // Update daycare with slug
        await db.query(
          'UPDATE daycares SET slug = $1 WHERE id = $2',
          [slug, daycare.id]
        );

        console.log(`✓ Updated ${daycare.name} → ${slug}`);
        updated++;
      } catch (error) {
        console.error(`✗ Error updating ${daycare.name}:`, error.message);
        errors++;
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Errors: ${errors}`);
    console.log(`   Total: ${result.rows.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

addSlugs();
