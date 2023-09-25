export const ANNOUNCEMENTS_QUERY = `
query {
  announcementCollection {
    items {
      backgroundColor
      ctaLabel
      ctaUrl
      intro
      message
    }
  }
}
`;
