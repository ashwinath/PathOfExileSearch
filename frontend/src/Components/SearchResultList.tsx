import * as React from "react";
import { mapSourceToName } from "../Utils/Mappers";
import { connect } from "react-redux";
import { Button, Row, Col, CardImg } from "reactstrap";
import { selectItem } from "../Actions";
import {
  LineChart,
  Line,
} from "recharts";
import {
  SearchResultListProps,
  MiscInformationProps,
  SearchResultItemProps,
} from "../Interfaces";
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
  private LEAGUE = "Delve";

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
      links,
      paySparkline,
      sparkline,
    } = this.props.data;
    const size = "4vw";
    const base = baseType ? baseType : mapSourceToName(source);

    let styles = {
      maxHeight: size,
      maxWidth: size,
      height: size,
      width: "auto",
    };

    if (source === "UniqueAccessory") {
      styles = {
        maxHeight: size,
        maxWidth: size,
        height: "auto",
        width: "100%",
      };
    }

    const chaosTradeValue = (1/chaosValue).toFixed(2);
    const nameEscaped = name.replace(/\ /g, "_");
    const wikiLink = `https://pathofexile.gamepedia.com/${nameEscaped}`;
    const linksIncluded = links !== 0 ? `&link_min=${links}&link_max=${links}` : "";
    const poeTradeUrl = `http://poe.trade/search?league=${this.LEAGUE}&name=${name}${linksIncluded}`;

    const sparklineToUse = sparkline ? sparkline : paySparkline;

    return (
      <Row
        onClick={this.onRowClick.bind(this, id)}
        id={id}
        className="d-flex align-items-center item-container item-hover">
        <Col className="center" xs="2">
          <CardImg
            style={styles}
            top={true}
            src={imageUrl}/>
        </Col>
        <Col className="center" xs="3">
          <h6>{name}</h6>
          <h6>{source === "Map" ? "" : base}</h6>
          {corrupted ?
            <h6 style={{color: "#d20000"}}>Corrupted</h6>
            : null
          }
        </Col>
        <MiscInformation {...this.props.data} />
        <Col className="center" xs="1">
          {sparklineToUse ? <PriceChart dataPoints={sparklineToUse} /> : null}
        </Col>
        <Col className="center" xs="2">
          {chaosValue < 1 ? <h6>1 x <CurrencyIcon type="chaos"/> => {chaosTradeValue}</h6> : <h6>{chaosValue} x <CurrencyIcon type="chaos"/></h6>}
          {exaltedValue ? <h6>{exaltedValue} x <CurrencyIcon type="exalted"/></h6> : null}
        </Col>
        <Col className="center" xs="2">
          <Button
            style={{ marginLeft: "5px", marginRight: "5px"}}
            href={wikiLink}
            color="info"
            target="_blank"
            rel="noopener noreferrer"><i className="fab fa-wikipedia-w"/></Button>
          <Button
            style={{ marginLeft: "5px", marginRight: "5px"}}
            href={poeTradeUrl}
            color="info"
            target="_blank"
            rel="noopener noreferrer"><i className="fas fa-search"/></Button>
        </Col>
      </Row>
    );
  }

  private onRowClick(id) {
    const { dispatch } = this.props;
    dispatch(selectItem(id));
  }
}

interface CurrencyIconProps {
  type: string;
}

function CurrencyIcon(props: CurrencyIconProps) {
  const size = "30px";
  const styles = {
    paddingRight: "3px",
    paddingTop: "3px",
    display: "inline-bloc",
    maxHeight: size,
    maxWidth: size,
    height: size,
    width: "auto",
  };
  const mappings = {
    "chaos": "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png?scale=1&w=1&h=1&v=c60aa876dd6bab31174df91b1da1b4f93",
    "exalted": "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyAddModToRare.png?scale=1&w=1&h=1&v=1745ebafbd533b6f91bccf588ab5efc53",
  }

  return (
    <span>
      <img style={styles} src={mappings[props.type]}/>
    </span>
  )
}

interface PriceChartProps {
  dataPoints: number[];
}

function PriceChart(props: PriceChartProps) {
  const dataFormatted = props.dataPoints.map((x, index) => ({ name: index, value: x}));
  /* special magic hardcoded numbers here */
  /* Recalculate this by width */
  /* Last decimal place is just fine tuning lul */
  const width = window.innerWidth * 1 / 12 * 7 / 12 * 0.8;
  return (
    <LineChart width={width} height={75} data={dataFormatted}>
      <Line type="monotone" dataKey="value" stroke="#ffffff" />
    </LineChart>
  );
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
        <Col className="center" xs="2">
          <h6>Level: {gemLevel}</h6>
          <h6>Quality: {gemQuality}</h6>
        </Col>
      );
    }
  } else if (source === "UniqueArmour" || source === "UniqueWeapon") {
    const linkedText = props.links === 0 ? "0-4 linked" : `${props.links}-linked`;
    return (
      <Col className="center" xs="2">
        <h6>{linkedText}</h6>
      </Col>
    );
  } else if (source === "DivinationCard") {
    const stackSize = props.stackSize;
    return (
      <Col className="center" xs="2">
        <h6>Stack: {stackSize}</h6>
      </Col>
    );
  }
  return (
    <Col className="center" xs="2"/>
  );
}

function mapStateToProps(state) {
  const poeItems = state.search.poeItems || [];
  const searchResultsList = poeItems.map((item) => {
    return {
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      chaosValue: item.chaosValue,
      exaltedValue: item.exaltedValue,
      source: item.source,
      links: item.links,
      baseType: item.baseType,
      corrupted: item.corrupted,
      gemLevel: item.gemLevel,
      gemQuality: item.gemQuality,
      stackSize: item.stackSize,
      paySparkline: item.paySparkline,
      sparkline: item.sparkline,
    }
  });
  return {
    searchResultsList,
  };
}

export default connect(mapStateToProps)(SearchResultList);
