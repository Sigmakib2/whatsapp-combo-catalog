import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

export default defineConfig({
  name: 'default',
  title: 'Catalog',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((template) => template.templateId !== 'siteSettings')
      }
      return prev
    },
    actions: (prev, { schemaType }) => {
      if (schemaType === 'siteSettings') {
        return prev.filter((action) =>
          ['publish', 'discardChanges', 'restore'].includes(action.action ?? ''),
        )
      }
      return prev
    },
  },
})
