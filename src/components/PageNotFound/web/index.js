import React from "react";
import useIcons from "../../../Assets/web/icons/useIcons";

export default function PageNotFound() {
  const { PageNotFoundIcon } = useIcons();
  return (
    <div className="h--full w--full d--flex align-items--center justify-content--center flex--column">
      <PageNotFoundIcon width={80} height={80} />
      <div className="h-min--40 w-max--200 rounded--sm   d--flex radius--full align-items--center justify-content--center p-l--md p-r--md c--pointer font--md flex--column">
        Page not Fond
      </div>
    </div>
  );
}
