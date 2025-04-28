const dataApi = {
  home: {
    tags: ["home"],
    url: "page/home",
    cache: 86400,
  },
  comments: {
    tags: ["comment"],
    url: "comment/null",
    cache: 86400,
  },
  footer: {
    tags: ["footer"],
    url: "page/footer",
    cache: 86400,
  },
  category: {
    tags: ["category"],
    url: "category",
    cache: 86400,
  },
  header: {
    tags: ["category"],
    url: "category",
    cache: 86400,
  },
  aboutUs: {
    tags: ["aboutUs"],
    url: "page/aboutMe",
    cache: 86400,
  },
  faqs: {
    tags: ["page/faqs"],
    url: "page/faqs",
    cache: 86400,
  },
  projects: {
    tags: ["project"],
    url: "project",
    cache: 86400,
  },
  singleProject: {
    tags: ["/project/..."],
    url: "project",
    cache: 86400,
  },
  posts: {
    tags: ["post"],
    url: "post",
    cache: 86400,
  },
  singlePost: {
    tags: ["/post/..."],
    url: "post",
    cache: 86400,
  },
  experts: {
    tags: ["worker"],
    url: "worker",
    cache: 86400,
  },
  singleExpert: {
    tags: ["/experts/..."],
    url: "worker",
    cache: 86400,
  },
  search: {
    tags: ["tag"],
    url: "tag",
    cache: 86400,
  },
  tags:{
    tags: ["tag"],
    url: "tag",
    cache: 86400,
  },
  expertName:{
    tags: ["worker"],
    url: "worker/name-worker",
    cache: 86400,
  },

};

export { dataApi };
