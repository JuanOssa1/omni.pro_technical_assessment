import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import { useDispatch } from "react-redux";
import { open } from "../ui/modalSlice";
import { useRef, useState } from "react";
import { Project } from "./types";
import { selectProject, removeProject, removeDbProject } from "./projectSlice";
import { AppDispatch } from "../../app/store";
import { Link } from "react-router-dom";
import defaultProjectImage from "./assets/defaultProjectImage.jpg";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef(null);
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        minWidth: "190px",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      <IconButton
        onClick={() => {
          dispatch(open());
          dispatch(selectProject(project.projectId));
        }}
        sx={{
          position: "absolute",
          top: "8px",
          right: "16px",
          margin: 0
        }}
      >
        <Icon>{"edit"}</Icon>
      </IconButton>
      <CardMedia
        onError={handleImageError}
        ref={cardRef}
        component="img"
        alt="project image"
        height="140"
        image={
          imageError || project.projectImageUrl === ""
            ? defaultProjectImage
            : project.projectImageUrl
        }
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {project.projectTitle}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {project.projectDescription}
        </Typography>
      </CardContent>
      <CardActions sx={{ mt: "auto" }}>
        <Link to={`project/${project.projectId}`}>
          <Button>More</Button>
        </Link>
        <Button
          onClick={() => {
            dispatch(removeDbProject(project.projectId));
            dispatch(removeProject(project.projectId));
          }}
          size="small"
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
