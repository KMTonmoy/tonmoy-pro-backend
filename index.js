const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://tonmoy-pro.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    console.log("Connected to MongoDB");

    const skillCollection = client.db("tonmoy").collection("skills");
    const projectCollection = client.db("tonmoy").collection("projects");
    const editorContentCollection = client.db("tonmoy").collection("EditorContent");

    // 🚀 GET All Skills
    app.get("/skills", async (req, res) => {
      const skills = await skillCollection.find().toArray();
      res.send(skills);
    });

    // 🔍 GET Single Skill by ID
    app.get("/skills/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const skill = await skillCollection.findOne({ _id: new ObjectId(id) });
        if (!skill) return res.status(404).send({ message: "Skill not found" });
        res.send(skill);
      } catch (error) {
        res.status(500).send({ message: "Invalid skill ID" });
      }
    });

    // ➕ POST New Skill
    app.post("/skills", async (req, res) => {
      const skill = req.body;
      const result = await skillCollection.insertOne(skill);
      res.send(result);
    });

    // ✏️ PATCH Update Skill
    app.patch("/skills/:id", async (req, res) => {
      const { id } = req.params;
      const updatedSkill = req.body;

      try {
        const result = await skillCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              name: updatedSkill.name,
              image: updatedSkill.image,
            },
          }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Skill not found" });
        }

        res.send({ acknowledged: true });
      } catch (error) {
        console.error("Error updating skill:", error);
        res.status(500).send({ message: "Failed to update skill" });
      }
    });

    // ❌ DELETE Skill
    app.delete("/skills/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await skillCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Delete failed" });
      }
    });

    // GET all projects
    app.get("/projects", async (req, res) => {
      const projects = await projectCollection.find().toArray();
      res.send(projects);
    });

    // GET a single project by ID
    app.get("/projects/:id", async (req, res) => {
      const { id } = req.params;
      const project = await projectCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!project)
        return res.status(404).send({ message: "Project not found" });
      res.send(project);
    });

    // POST a new project
    app.post("/projects", async (req, res) => {
      const project = req.body;
      const result = await projectCollection.insertOne(project);
      res.send(result);
    });

    // PATCH (update) a project
    app.patch("/projects/:id", async (req, res) => {
      const { id } = req.params;
      const updatedProject = req.body;

      const result = await projectCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            title: updatedProject.title,
            description: updatedProject.description,
            image: updatedProject.image,
            tags: updatedProject.tags,
            link: updatedProject.link,
            detailsLink: updatedProject.detailsLink,
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({ message: "Project not found" });
      }

      res.send({ acknowledged: true });
    });

    // DELETE a project
    app.delete("/projects/:id", async (req, res) => {
      const { id } = req.params;
      const result = await projectCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.post("/editor-content", async (req, res) => {
      const {  title, description, image } = req.body;

      if (!title || !description || !image) {
        return res
          .status(400)
          .send({ error: "Title, description, and image are required" });
      }

      try {
        const result = await editorContentCollection.insertOne({
          
          title,
          description,
          image,
          timestamp: new Date(),
        });
        res.status(201).send({ message: "Blog saved successfully", result });
      } catch (error) {
        console.error("Error saving blog:", error);
        res.status(500).send({ error: "Failed to save blog" });
      }
    });

    app.get("/editor-content", async (req, res) => {
      try {
        const content = await editorContentCollection.find().toArray();
        res.send(content);
      } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).send({ error: "Failed to fetch content" });
      }
    });


    


app.delete("/editor-content/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await editorContentCollection.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Content not found" });
    }

    res.send({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).send({ error: "Failed to delete content" });
  }
});
 







    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } finally {
    process.on("SIGINT", async () => {});
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tonmoy Pro is sitting");
});
