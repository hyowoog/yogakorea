import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("pages/:slug", "routes/pages.$slug.tsx"),
  ...prefix("board", [
    route(":boardId", "routes/board.$boardId._index.tsx"),
    route(":boardId/write", "routes/board.$boardId.write.tsx"),
    route(":boardId/:postId", "routes/board.$boardId.$postId.tsx"),
    route(":boardId/:postId/edit", "routes/board.$boardId.$postId.edit.tsx"),
    route(":boardId/:postId/delete", "routes/board.$boardId.$postId.delete.tsx"),
  ]),
  route("api/upload", "routes/api.upload.tsx"),
  route("api/files/*", "routes/api.files.$.tsx"),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  ...prefix("admin", [
    index("routes/admin._index.tsx"),
    ...prefix("members", [
      index("routes/admin.members._index.tsx"),
      route("export", "routes/admin.members.export.tsx"),
      route("api/:licId", "routes/admin.members.api.$licId.tsx"),
      route(":licId", "routes/admin.members.$licId.tsx"),
    ]),
    ...prefix("licenses", [
      index("routes/admin.licenses._index.tsx"),
      route("export", "routes/admin.licenses.export.tsx"),
      route("api/:id", "routes/admin.licenses.api.$id.tsx"),
    ]),
    ...prefix("educations", [
      index("routes/admin.educations._index.tsx"),
      route("export", "routes/admin.educations.export.tsx"),
      route("api/:id", "routes/admin.educations.api.$id.tsx"),
    ]),
    ...prefix("branches", [
      index("routes/admin.branches._index.tsx"),
      route("export", "routes/admin.branches.export.tsx"),
      route("api/:id", "routes/admin.branches.api.$id.tsx"),
    ]),
    route("slides", "routes/admin.slides._index.tsx"),
    ...prefix("events", [
      index("routes/admin.events._index.tsx"),
      route("api/:id", "routes/admin.events.api.$id.tsx"),
      route(":eventId", "routes/admin.events.$eventId.tsx"),
      route(":eventId/export", "routes/admin.events.$eventId.export.tsx"),
      route(
        ":eventId/api/:applicationId",
        "routes/admin.events.$eventId.api.$applicationId.tsx",
      ),
    ]),
    ...prefix("tshirts", [
      index("routes/admin.tshirts._index.tsx"),
      route("export", "routes/admin.tshirts.export.tsx"),
    ]),
  ]),
  route("events/:eventId/apply", "routes/events.$eventId.apply.tsx"),
  ...prefix("renew", [
    index("routes/renew._index.tsx"),
    route("pages/:slug", "routes/renew.pages.$slug.tsx"),
    route("board/:boardId", "routes/renew.board.$boardId._index.tsx"),
  ]),
] satisfies RouteConfig;
