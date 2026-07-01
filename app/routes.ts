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
  ...prefix("legacy", [
    index("routes/legacy._index.tsx"),
    route("pages/:slug", "routes/legacy.pages.$slug.tsx"),
    route("board/:boardId", "routes/legacy.board.$boardId._index.tsx"),
    route("board/:boardId/:postId", "routes/legacy.board.$boardId.$postId.tsx"),
  ]),
] satisfies RouteConfig;
