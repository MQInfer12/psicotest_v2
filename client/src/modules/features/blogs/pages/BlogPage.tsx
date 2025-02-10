import Canvas from "@/modules/core/components/ui/canvas/Canvas";
import { STORAGE_URL } from "@/modules/core/constants/ENVIRONMENT";
import { formatDate } from "@/modules/core/utils/formatDate";
import { Blog } from "../api/responses";

interface Props {
  blog: Blog;
  preview?: boolean;
}

const BlogPage = ({ blog, preview }: Props) => {
  return (
    <Canvas type="blog" withFooter>
      <Canvas.Title
        photoSrc={blog.autor.foto}
        subtitle={`${blog.autor.nombre} • ${formatDate(blog.updated_at)}`}
        coverSrc={preview ? blog.portada : STORAGE_URL + blog.portada}
        description={blog.descripcion}
        showCover
      >
        {blog.titulo}
      </Canvas.Title>
      {blog.config.map((item, i) => {
        switch (item.type) {
          case "paragraph":
            return <Canvas.Paragraph key={i}>{item.content}</Canvas.Paragraph>;
          case "subtitle":
            return <Canvas.Subtitle key={i}>{item.content}</Canvas.Subtitle>;
          case "vignette":
            return (
              <Canvas.Vignette key={i} subtitle={item.title}>
                {item.content}
              </Canvas.Vignette>
            );
        }
        return null;
      })}
      {/* <Canvas.Image
        src={Stock1}
        alt="Hola"
        description="Hola, Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, eos non
        optio eligendi similique repudiandae ipsa voluptas. Incidunt rem
        repudiandae eligendi debitis fuga labore illum odio ut veniam architecto
        quasi enim"
      />
      <Canvas.Pdf src={"http://localhost:8000/storage/BULIMIA.pdf"} /> */}
    </Canvas>
  );
};

export default BlogPage;
