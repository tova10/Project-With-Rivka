import { useParams } from "react-router-dom";

function Photos() {
  const { albumId } = useParams();

  return <h2>Photos of album {albumId}</h2>;
}

export default Photos;
