module.exports = (app) => {
    const auth = require("../middleware/auth");
    const authRefresh = require("../middleware/authRefresh");
    const upload = require("../middleware/upload");
    const express = require("express");
    const router = express.Router();
    const article = require("../controllers/controller_articles");

    // routes access front to back

    router.get("/article/:id", auth, authRefresh, article.article);
    router.get("/edit_article/:id", auth, authRefresh, article.editArticle);
    router.get("/autor/", auth, authRefresh, article.autor);

    router.post("/articles", auth, authRefresh, article.articles);
    router.post("/add/", auth, authRefresh, article.add);
    router.post("/update", auth, authRefresh, article.update);
    router.post(
        "/upload/",
        auth,
        authRefresh,
        upload.single("img"),
        article.upload
    );
    router.post("/addComment/", auth, authRefresh, article.addComment);

    router.put("/publish/", auth, authRefresh, article.publish);

    router.delete("/article/", auth, authRefresh, article.delArticle);
    router.delete("/comment/", auth, authRefresh, article.delComment);
    router.delete("/file/", auth, authRefresh, article.delFile);

    app.use("/api/edit", router);
};
