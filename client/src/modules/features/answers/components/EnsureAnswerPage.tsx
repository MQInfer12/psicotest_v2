import { fetchOptions } from "@/modules/core/hooks/useFetch/utils/fetchFn";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import AnswerPage from "../pages/AnswerPage";

interface Props {
  id: number | null;
  loading: number | null;
  setLoading: React.Dispatch<React.SetStateAction<number | null>>;
}

const EnsureAnswerPage = ({ id, loading, setLoading }: Props) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchFn = async () => {
      await queryClient.ensureQueryData(
        fetchOptions(
          [
            "GET /test/for/respuesta/:id",
            {
              id: Number(id),
            },
          ],
          {},
          {
            gcTime: 0,
          }
        )
      );
      setLoading(null);
    };

    fetchFn();
  }, []);

  if (loading) return;
  return <AnswerPage id={id} />;
};

export default EnsureAnswerPage;
