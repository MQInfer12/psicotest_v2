import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useKonamiCode } from "@/modules/core/hooks/useKonamiCode";
import { TestIds } from "../types/TestIds";
import { MAPITest } from "../modules/MAPI/data";
import { KUDERTest } from "../modules/KUDER/data";
import { PMATest } from "../modules/PMA/data";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { BIGFIVETest } from "../modules/BIG_FIVE/data";
import { CHASIDETest } from "../modules/CHASIDE/data";

export const useUpdateTests = () => {
  const { postData, getDataSetter } = useFetch();
  const mutation = postData("PUT /test/update/db");
  const setter = getDataSetter("GET /test");
  useKonamiCode(
    true,
    () => {
      mutation(
        {
          tests: [
            {
              id: TestIds.MAPI,
              test: JSON.stringify(MAPITest),
            },
            {
              id: TestIds.KUDER,
              test: JSON.stringify(KUDERTest),
            },
            {
              id: TestIds.PMA,
              test: JSON.stringify(PMATest),
            },
            {
              id: TestIds.BIG_FIVE,
              test: JSON.stringify(BIGFIVETest),
            },
            {
              id: TestIds.CHASIDE,
              test: JSON.stringify(CHASIDETest),
            },
          ],
        },
        {
          onSuccess: (res) => {
            toastSuccess(res.message);
            setter(res.data);
          },
        }
      );
    },
    []
  );
};
