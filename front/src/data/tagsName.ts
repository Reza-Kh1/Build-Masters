const dataApi = {
  home: {
    tags: ["home"],
    url: "pages?page=home",
    // cache: 86400,
    cache: 1,
  },
  aboutUs: {
    tags: ["aboutUs"],
    url: "pages?page=aboutMe",
    // cache: 86400,
    cache: 1,
  },
  faqs: {
    tags: ["page/faqs"],
    url: "pages?page=faqs",
    // cache: 86400,
    cache: 1,
  },
  footer: {
    tags: ["footer"],
    url: "pages?page=footer",
    // cache: 86400,
    cache: 1,
  },
  comments: {
    tags: ["comment"],
    url: "comment/null",
    // cache: 86400,
    cache: 1,
  },
  category: {
    tags: ["category"],
    url: "category",
    // cache: 86400,
    cache: 1,
  },
  header: {
    tags: ["category"],
    url: "category",
    // cache: 86400,
    cache: 1,
  },
  projects: {
    tags: ["project"],
    url: "project",
    // cache: 86400,
    cache: 1,
  },
  singleProject: {
    tags: ["/project/..."],
    url: "project",
    // cache: 86400,
    cache: 1,
  },
  posts: {
    tags: ["post"],
    url: "post",
    // cache: 86400,
    cache: 1,
  },
  singlePost: {
    tags: ["/post/..."],
    url: "post",
    // cache: 86400,
    cache: 1,
  },
  contractor: {
    tags: ["contractor"],
    url: "contractor",
    // cache: 86400,
    cache: 1,
  },
  singleExpert: {
    tags: ["/contractor/..."],
    url: "contractor",
    // cache: 86400,
    cache: 1,
  },
  search: {
    tags: ["tag"],
    url: "tag",
    // cache: 86400,
    cache: 1,
  },
  tags: {
    tags: ["tag"],
    url: "tag",
    // cache: 86400,
    cache: 1,
  },
  expertName: {
    tags: ["worker"],
    url: "worker/name-worker",
    // cache: 86400,
    cache: 1,
  },

};

export { dataApi };
