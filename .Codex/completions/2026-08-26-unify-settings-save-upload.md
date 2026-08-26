# Unify settings save and image upload flow

- Removed the duplicate settings submit button; the admin settings form now has one save action.
- Added upload progress callbacks for logo, hero, and CTA images.
- The save button is disabled while any image is compressing or uploading and shows a waiting state.
- Validation: `npx tsc --noEmit` passes; editor diagnostics report no errors.
- Existing unrelated working-tree changes were preserved.
