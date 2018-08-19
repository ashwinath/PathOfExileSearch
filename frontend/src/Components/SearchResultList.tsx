import * as React from "react";
import {
  SearchResultListProps,
  MiscInformationProps,
  SearchResultItemProps,
} from "../Interfaces";
import { mapSourceToName } from "../Utils/Mappers";
import { connect } from "react-redux";
import { Row, Col, CardImg } from "reactstrap";
import { selectItem } from "../Actions";
import "./SearchResultList.css";

function SearchResultList(props: SearchResultListProps) {
  return (
    <div className="result-list">
      {props.searchResultsList.map((item) => {
        return (
          <VisibleSearchResultItem
            key={"" + item.id + "result"}
            data={{...item}}/>
        )
      })}
    </div>
  )
}

class SearchResultItem extends React.Component<SearchResultItemProps, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    const {
      name,
      imageUrl,
      chaosValue,
      exaltedValue,
      source,
      baseType,
      corrupted,
      id,
    } = this.props.data;
    const size = "65px";
    const base = baseType ? baseType : mapSourceToName(source);

    return (
      <Row
        onClick={this.onRowClick.bind(this, id)}
        id={id}
        className="d-flex align-items-center item-container item-hover">
        <Col className="center" ms="2">
          <CardImg
            style={{
              maxHeight: size,
              maxWidth: size,
              height: size,
              width: "auto",
            }}
            top={true}
            src={imageUrl}/>
        </Col>
        <Col className="center" ms="2">
          <h6>{name}</h6>
        </Col>
        <Col className="center" ms="2">
          <h6>{base}</h6>
        </Col>
        <MiscInformation {...this.props.data} />
        <Col className="center" ms="1">
          <h6>{corrupted ? "Corrupted": "Not corrupted"}</h6>
        </Col>
        <Col className="center" ms="1">
          <h6>{chaosValue} Chaos</h6>
        </Col>
        <Col className="center" ms="1">
          <h6>{exaltedValue} Exalteds</h6>
        </Col>
      </Row>
    );
  }

  private onRowClick(id) {
    const { dispatch } = this.props;
    dispatch(selectItem(id));
  }
}

const VisibleSearchResultItem = connect()(SearchResultItem);

function MiscInformation(props: MiscInformationProps) {
  const { source } = props;
  if (source === "SkillGem"
    && props.links !== null
    && props.links !== undefined) {
    const { gemLevel, gemQuality } = props;
    if (gemLevel !== undefined
      && gemLevel !== null
      && gemQuality !== undefined
      && gemQuality !== null) {
      return (
        <Col className="center" ms="3">
          <h6>Level: {gemLevel}</h6>
          <h6>Quality: {gemQuality}</h6>
        </Col>
      );
    }
  } else if (source === "UniqueArmour" || source === "UniqueWeapon") {
    const linkedText = props.links === 0 ? "0-4 linked" : `${props.links}-linked`;
    return (
      <Col className="center" ms="3">
        <h6>{linkedText}</h6>
      </Col>
    );
  }
  return (
    <Col className="center" ms="3"/>
  );
}

export default SearchResultList;
