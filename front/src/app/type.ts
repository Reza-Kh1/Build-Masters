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
  id: number;
  title: string;
  image: string;
  description: string;
  totalComments: number;
  status: boolean;
  updatedAt: Date;
  DetailPost: {
    text: string;
    title: string;
    keyword: string[];
  };
  User: {
    name: string;
  };
  Tags: TagsType[];
  Category: CategoryType;
  Comments: CommentsType[];
};
type AllPostType = {
  count: number;
  rows: CardPostType[];
  paginate: PaginationType;
};
type TagsType = {
  id: number;
  name: string;
};
type Footertype = {
  data: {
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
};
type AboutUsType = {
  data: {
    id: number;
    page: string;
    text: {
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
  } | null;
};
type FaqsType = {
  data: {
    id: number;
    page: string;
    text: {
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
    };
  } | null;
};
type ImageType = {
  url: string;
  alt: string;
};
type CommentsPage = {
  comments: {
    count: number;
    rows: CommentsType[];
  };
  paginate: PaginationType;
  countNull: number;
};
type FilterQueryType = {
  search?: string;
  order?: string;
  page?: string;
  tags?: string;
  expert?: string;
};
type ExpertType = {
  id: number;
  name: string;
  phone: string;
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
  }[];
  address: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  Tags?: TagsType[];
  Projects: CardProjectsType[];
};
type AllExpertType = {
  count: number;
  rows: ExpertType[];
  paginate: PaginationType;
};
type AllProjectType = {
  count: number;
  rows: CardProjectsType[];
  paginate: PaginationType;
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
  Worker: ExpertType;
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
  data: {
    page: string
    text: {
      tabImage: { alt: string, url: string } | null,
      tabs: TabDataType[],
      heroData: HeroDataType[]
    }
  }
}
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
  ExpertType,
  AllExpertType,
  AllProjectType,
  ProjectType,
  HomePageType,
  HeroDataType,
  TabDataType
};
