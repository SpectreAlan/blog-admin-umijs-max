declare namespace Comment {
    interface CommentItem {
        id: string;
        article: string;
        nickName: string;
        email: string;
        parentId: string;
        pinned: number;
        author: number;
        status: number;
    }
}
