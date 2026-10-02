import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Catalog')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings'),
        ),
      S.listItem()
        .title('Offers')
        .schemaType('offer')
        .child(
          S.documentTypeList('offer')
            .title('Offers')
            .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }]),
        ),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== 'siteSettings' && item.getId() !== 'offer',
      ),
    ])
