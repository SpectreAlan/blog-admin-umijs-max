declare namespace Article {
  interface ArticleItem {
    id: string;
    title: string;
    category: {
      title: string
    }
    tags: {
      title: string
      _id: string
    }[]
  }
  interface Form {
    id: string;
    title: string;
    content: string;
    description: string;
    category: string
    keywords: string
    catalogue: boolean
    status: number
    scan: number
    cover: string
    tags: string[]
  }

  interface Option {
    title: string
    id: string
  }
}
