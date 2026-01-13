// Quick script to fix missing daycare slugs
import db from './db/index.js';

// Function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

async function fixSlugs() {
  try {
    console.log('🔄 Fixing missing slugs...\n');

    // Get all daycares
    const result = await db.query(
      'SELECT id, name, slug FROM daycares ORDER BY name'
    );

    console.log(`📋 Checking ${result.rows.length} daycares...\n`);

    let updated = 0;
    let skipped = 0;

    for (const daycare of result.rows) {
      // Skip if already has a slug
      if (daycare.slug && daycare.slug.length > 0) {
        console.log(`⏭️  Skipping ${daycare.name} (already has slug: ${daycare.slug})`);
        skipped++;
        continue;
      }

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
        'UPDATE daycares SET slug = $1, updated_at = NOW() WHERE id = $2',
        [slug, daycare.id]
      );

      console.log(`✅ ${daycare.name} → ${slug}`);
      updated++;
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Done!`);
    console.log(`   Updated: ${updated} daycares`);
    console.log(`   Skipped: ${skipped} daycares (already had slugs)`);
    console.log(`   Total: ${result.rows.length} daycares`);
    console.log(`${'='.repeat(60)}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixSlugs();
