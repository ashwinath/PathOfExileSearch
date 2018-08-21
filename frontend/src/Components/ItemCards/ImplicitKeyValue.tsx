import * as React from "react";
import "./Cards.css";

interface ImplicitKeyValueProps {
  implicitKey: string;
  implicitValue: string | number;
}

function ImplicitKeyValue(props: ImplicitKeyValueProps) {
  const { implicitKey, implicitValue } = props;
  return (
    <p className="implicit-border essence-implicit">
      <span className="implicit-key">{implicitKey}:</span><span className="implicit-value"> {implicitValue}</span>
    </p>
  );
}

export default ImplicitKeyValue;
