type CardPostType = {
  Category?: { slug: string; name: string };
  description: string;
  id: number;
  image: string;
  status: boolean;
  title: string;
  totalComments: null | number;
  updatedAt: Date;
};
type TagsType = {
  id: number;
  name: string;
};
type ALlPostCategory = {
  count: number;
  rows: CardPostType[];
  category: {
    id: number;
    name: string;
  };
  paginate: PaginationType;
};
type AllCardPostType = {
  count: number;
  rows: CardPostType[];
  paginate: PaginationType;
};
type CategoryType = {
  id: number;
  name: string;
  slug: string;
  parentCategoryId: number | null;
  subCategory: CategoryType[] | [];
};
type PaginationType = {
  allPage: number;
  nextPage?: number;
  prevPage?: number;
};
type CardProjectsType = {
  id: number;
  name: string;
  address: string;
  image: string;
  alt: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  workerId: number;
  Worker: {
    name: string;
  };
  Tags?: TagsType[]
};
type CommentsType = {
  id: number;
  position: "USER" | "ADMIN" | "AUTHOR";
  name: string;
  text: string;
  createdAt: Date;
  replies: CommentsType[];
};
type PostType = {
  id: number
  name: string
  image: string
  description: string
  isPublished: boolean
  totalComment: number
  createdAt: Date
  updatedAt: Date
  userId: string
  categoryId: number,
  DetailPost: {
    id: number,
    content: string
    title: string
    keyword: string[]
    postId: number
  }
  Tags: TagsType[];
  Category: CategoryType;
  Comment: CommentsType[];
  user: { name: string }
};
type AllPostType = {
  data: PostType[];
  pagination: PaginationType;
};

type Footertype = {
  id: number;
  page: string;
  text: {
    text: string;
    logoUrl: {
      alt: string;
      url: string;
    };
    menuLink: {
      id: number;
      link: string;
      name: string;
    }[][];
  };
} | null;
type AboutUsType = {
  id: number;
  page: string;
  content: {
    text1: string | null;
    text2: string | null;
    title1: string | null;
    title2: string | null;
    imgArry: {
      alt: string;
      url: string;
    }[];
    textArry: {
      id: number;
      text: string;
    }[];
  };
  keyword: string[]
  description: string
  title: string
  canonicalUrl: string
} | null;
type FaqsType = {
  id: number;
  page: string;
  content: {
    title: string;
    accordion: {
      id: number;
      name: string;
      arry: {
        id: number;
        name: string;
        text: string;
      }[];
    }[];
    description: string;
  }
  keyword: string[]
  description: string
  title: string
  canonicalUrl: string
} | null
type ImageType = {
  url: string;
  alt: string;
};
type CommentsPage = {
  comments: {
    count: number;
    rows: CommentsType[];
  };
  pagination: PaginationType;
  countNull: number;
};
type FilterQueryType = {
  search?: string;
  order?: string;
  page?: string;
  tags?: string;
  expert?: string;
};
type ContractorType = {
  id: number
  name: string
  phone: string
  email: string
  socialMedia: {
    id: number;
    link: string;
    text: string;
    type:
    | "whatsapp"
    | "telegram"
    | "instagram"
    | "phone"
    | "web"
    | "twitter"
    | "linkedin";
  }[],
  bio: string
  avatar: string
  totalComment: number
  rating: string
  createdAt: Date
  updatedAt: Date
  categoryId: number
  userId: string
  Tags: TagsType[]
  Project: ProjectType[]
  Category: CategoryType
  Comment: CommentsType[]
};
type AllContractorType = {
  data: ContractorType[];
  pagination: PaginationType;
};
type AllProjectType = {
  data: CardProjectsType[];
  pagination: PaginationType;
};
type ProjectType = {
  id: number;
  name: string;
  address: string;
  image: string;
  gallery: ImageType[];
  video: string | null;
  alt: string;
  description: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  workerId: number;
  size: null | string
  price: null | string
  Worker: ContractorType;
  Tags: TagsType[];
};
type HeroDataType = {
  id: number
  img: string
  title: string
  text: string
  alt: string
}
type TabDataType = {
  id: number
  text: string
  title: string
}
type HomePageType = {
  page: string
  content: {
    tabImage: { alt: string, url: string } | null,
    tabs: TabDataType[],
    heroData: HeroDataType[]
  }
  keyword: string[]
  description: string | null
  title: string | null
  canonicalUrl: string | null
} | null
export type {
  FaqsType,
  ImageType,
  AboutUsType,
  Footertype,
  CardPostType,
  PostType,
  ALlPostCategory,
  AllCardPostType,
  PaginationType,
  CardProjectsType,
  CategoryType,
  CommentsType,
  AllPostType,
  CommentsPage,
  TagsType,
  FilterQueryType,
  ContractorType,
  AllContractorType,
  AllProjectType,
  ProjectType,
  HomePageType,
  HeroDataType,
  TabDataType
};
