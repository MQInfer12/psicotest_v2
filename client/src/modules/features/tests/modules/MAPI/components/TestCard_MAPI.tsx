import { useNavigate } from "@tanstack/react-router";
import TestCard from "../../../components/TestCard";

const TestCard_MAPI = () => {
  const navigate = useNavigate();

  const navigateToTest = () => {
    navigate({ to: "/tests/mapi" });
  };

  return (
    <TestCard
      starred
      title="MAPI"
      description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae vero
        placeat impedit sed sunt, excepturi dignissimos ab repudiandae inventore
        nesciunt eos, fugiat ducimus ex. Ab impedit possimus cum itaque sit
        consequatur. Magni autem odit exercitationem saepe asperiores
        praesentium similique rerum!"
      author="MILLON"
      psychologist="Mauricio Molina"
      users={[
        "https://www.purina.es/sites/default/files/styles/ttt_image_510/public/2024-02/sitesdefaultfilesstylessquare_medium_440x440public2022-06Siamese201.jpg?itok=j9A2IvjN",
        "https://www.elmueble.com/medio/2022/06/16/gato-comun-europeo_ead1005b_1000x666.jpg",
        "https://www.lavanguardia.com/files/image_990_484/files/fp/uploads/2022/12/09/6393714e2ee61.r_d.960-640-5156.jpeg",
        "https://www.elmueble.com/medio/2022/06/16/gato-comun-europeo_ead1005b_1000x666.jpg",
        "https://www.lavanguardia.com/files/image_990_484/files/fp/uploads/2022/12/09/6393714e2ee61.r_d.960-640-5156.jpeg",
        "https://www.elmueble.com/medio/2022/06/16/gato-comun-europeo_ead1005b_1000x666.jpg",
        "https://www.lavanguardia.com/files/image_990_484/files/fp/uploads/2022/12/09/6393714e2ee61.r_d.960-640-5156.jpeg",
        "https://www.elmueble.com/medio/2022/06/16/gato-comun-europeo_ead1005b_1000x666.jpg",
        "https://www.purina.es/sites/default/files/styles/ttt_image_510/public/2024-02/sitesdefaultfilesstylessquare_medium_440x440public2022-06Siamese201.jpg?itok=j9A2IvjN",
      ]}
      resolve={navigateToTest}
      edit={() => {}}
      share={() => {}}
    />
  );
};

export default TestCard_MAPI;
