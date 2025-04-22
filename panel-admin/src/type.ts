type CategortType = {
  id: string;
  name: string;
  slug: string;
  subCategoryId: null | string;
  SubCategoryTo: null | {
    name: string;
  };
};

type UserArrayType = {
  count: number;
  data: UserType[];
  pagination: PaginationType;
};

type PaginationType = {
  allPage: number;
  nextPage?: number;
  prevPage?: number;
};

type UserType = {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt: Date;
};

type FormPostType = {
  title: string;
  description: string;
  status: boolean;
  categoryId: string;
  titleDetail: string;
};

type FormDetailType = {
  text: string;
  title: string;
  keyward: string[];
  id: string;
};

type AllPostType = {
  count: number;
  rows: PostType[];
  paginate: PaginationType;
};

type PostType = {
  id: number;
  title: string;
  image: null;
  slug: string;
  description: string;
  totalComments: null;
  status: true;
  updatedAt: Date;
  Category: {
    slug: string;
    name: string;
  };
  User: {
    name: string;
  };
};

type SinglePostType = {
  id: string;
  title: string;
  image: string;
  slug: string;
  description: string;
  totalComments: null | number;
  status: boolean;
  updatedAt: Date;
  DetailPost: {
    text: string | null;
    title: string | null;
    keyword: null | string[];
  };
  User: {
    name: string;
  };
  Category?: {
    name: string;
    id: string;
    slug: string;
  };
  Tags: {
    id: number;
    name: string;
  }[];
};

type AllReviewType = {
  data: ReviewType[];
  pagination: PaginationType;
};

type ReviewType = {
  id: number;
  isPublished: boolean;
  name: string;
  phone: string;
  content: string;
  rating: string | null;
  postId: null | number;
  contractorId: null | number;
  commentReply: null | number;
  createdAt: Date;
  roleType: "USER" | "CONTRACTOR" | "AUTHOR" | "ADMIN";
  Post?: {
    id: string;
    title?: string;
  };
};

type LinkSidebarType = {
  icon: React.ReactNode;
  url: string;
  name: string;
};

type AllonlinePriceType = {
  data: OnlinePriceType[];
  pagination: PaginationType;
};

type OnlinePriceType = {
  id: number;
  name: string;
  phone: string;
  price: string;
  description: string;
  subject: string;
  images: string[];
  size: string;
  isStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type AllMessageType = {
  count: number;
  rows: MessageType[];
  paginate: PaginationType;
};

type MessageType = {
  id: number;
  name: string;
  phone: string;
  status: boolean;
  subject: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};

type MediaType = {
  url: string;
  id: number;
  status: boolean;
  uploader: "ADMIN" | "USER";
  type: "VIDEO" | "IMAGE";
};

type DataMediaType = {
  url: string;
  alt?: string;
};

type TagType = {
  id: number;
  name: string;
};

type ContractorType = {
  id: number;
  name: string;
  phone: string;
  email: string;
  socialMedia: string | null;
  bio: string;
  avatar: string;
  totalComment: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  userId: string | null;
  Tags: TagType[] | [];
};

type AllContractorType = {
  data: ContractorType[];
  pagination: PaginationType;
};

type ProjectType = {
  id: number;
  name: string;
  slug: string;
  address: string;
  image: string;
  gallery: string[];
  video: string;
  description: string;
  stratDate: Date;
  endDate: Date;
  price: string;
  isPublished: true;
  categoryId: number;
  contractorId: number;
  createdAt: Date;
  updateAt: Date;
  Category: {
    name: string;
    slug: string;
  };
  Contractor: {
    name: string;
    rating: string;
    phone: string;
    createdAt: Date;
  };
  Tags: { name: string; id: string }[];
};

type AllProjectType = {
  data: ProjectType[];
  pagination: PaginationType;
};

type BackUpAllType = {
  success: boolean;
  backups: {
    key: string;
    url: string;
    lastModified: Date;
  }[];
};

type FieldsType = {
  className?: string;
  required?: boolean;
  label: string;
  name: string;
  icon?: React.ReactNode;
  type:
    | "text"
    | "select"
    | "autoComplate"
    | "date"
    | "checkBox"
    | "number"
    | "text-multiline";
  nameGetValue?: string;
  dataOptions?: {
    name?: string | React.ReactNode;
    value?: string;
    id?: number | string;
  }[];
};

export type {
  ReviewType,
  CategortType,
  UserArrayType,
  PaginationType,
  UserType,
  FormPostType,
  FormDetailType,
  AllPostType,
  PostType,
  SinglePostType,
  AllReviewType,
  LinkSidebarType,
  OnlinePriceType,
  AllonlinePriceType,
  AllMessageType,
  MessageType,
  MediaType,
  DataMediaType,
  TagType,
  ContractorType,
  AllContractorType,
  AllProjectType,
  ProjectType,
  BackUpAllType,
  FieldsType,
};
