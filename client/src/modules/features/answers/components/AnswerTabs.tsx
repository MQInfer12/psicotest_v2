import AnswerCardTemplate from "./AnswerCardTemplate";
import Interpretation from "./tabs/Interpretation";
import ResponsesTable from "./tabs/ResponsesTable";

const AnswerTabs = () => {
  return (
    <AnswerCardTemplate
      tabs={[
        {
          title: "Resultados",
          component: <ResponsesTable />,
        },
        {
          title: "Interpretación",
          component: <Interpretation />,
        },
      ]}
      gridArea="tabs"
    />
  );
};

export default AnswerTabs;
