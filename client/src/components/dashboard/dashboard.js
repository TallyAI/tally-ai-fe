import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

import Tabs from "./Tabs";

import WidgetDisplayList from "../WidgetSystem/WidgetDisplayList";
import WidgetAdditionList from "../WidgetSystem/WidgetAdditionList";
import Sidebar from "./Sidebar";

import {
  fetchWordsOverTime,
  fetchTopAndBottom,
  fetchAllData
} from "../../actions/index";
import DashboardPlus from "./dashboardPlus";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
    paddingTop: "5%",
    flexDirection: "column"
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

function DashboardGrid(props) {
  const classes = useStyles();

  // Fetch data for widgets
  useEffect(() => {
    console.log("Fetching all widget data with ID ", props.id);

    // Only fetch data if a selected business is in the businesses or competitors array
    // or if the user is not logged in
    if (
      businessesContains(props.businessInfo.businessId) ||
      !localStorage.getItem("token")
    ) {
      props.fetchAllData(props.id);
    }

    // props.fetchTopAndBottom(props.id);
    // props.fetchWordsOverTime(props.id);
  }, [props.businessInfo, props.competitors, props.userBusinesses]);

  return (
    <div className="dashboardgrid">
      <div>
        <Sidebar />
      </div>
      {/* // TODO: DOCUMENT WHAT'S GOING ON HERE */}
      <div style={{ width: "100%" }}>
        {localStorage.getItem("token") && localStorage.getItem("userID") ? (
          <div style={{ width: "100%" }}>
            <Tabs />
            {businessesContains(props.businessInfo.businessId) ? (
              <div>
                <div className="businessStats">
                  <div className="reviews">
                    <p style={{ fontWeight: "bold" }}>
                      {props.businessInfo.reviewCount}
                    </p>
                    <br />
                    <p style={{ fontSize: "1rem" }}>Total Reviews</p>
                  </div>
                  <div className="ratings">
                    <p style={{ fontWeight: "bold" }}>
                      {props.businessInfo.averageRating}
                    </p>
                    <br />
                    <p style={{ fontSize: "1rem" }}>Overall Rating</p>
                  </div>
                  <div className="changeofrating">
                    <p style={{ fontWeight: "bold" }}>11%</p>
                    <br />
                    <p style={{ fontSize: "1rem" }}>Change in Rating</p>
                  </div>
                </div>
                <WidgetDisplayList />
              </div>
            ) : (
              <DashboardPlus />
            )}
          </div>
        ) : props.businessInfo.businessId ? ( //if a business is selected
          <div>
            {console.log(
              "Not Redirecting cause business selected while on dashboard. Business selected:",
              props.businessInfo.businessId
            )}
            <div className="businessStats">
              <div className="reviews">
                <p style={{ fontWeight: "bold" }}>
                  {props.businessInfo.reviewCount}
                </p>
                <br />
                <p style={{ fontSize: "1rem" }}>Total Reviews</p>
              </div>
              <div className="ratings">
                <p style={{ fontWeight: "bold" }}>
                  {props.businessInfo.averageRating}
                </p>
                <br />
                <p style={{ fontSize: "1rem" }}>Overall Rating</p>
              </div>
              <div className="changeofrating">
                <p style={{ fontWeight: "bold" }}>11%</p>
                <br />
                <p style={{ fontSize: "1rem" }}>Change in Rating</p>
              </div>
            </div>
            <WidgetDisplayList />
          </div>
        ) : (
          console.log(
            "Redirecting cause no business selected while on dashboard. Business selected:",
            props.businessInfo.businessId
          ) & props.history.push("/") //FIXME: while deployed, instead of re-routing to just tally-ai.com/ it goes to tally-ai.com/index.html. This causes errors.
        )}
      </div>
    </div>
  );

  //used to check if this is an actual business or just a new tab
  function businessesContains(businessId) {
    console.log("props.businesses in businessContains: ", props.businesses);

    if (!businessId) {
      return false;
    }

    let found = false;
    props.businesses.forEach(element => {
      if (element.businessId === businessId) {
        found = true;
      }
    });
    return found;
  }
}

const mapStateToProps = state => ({
  // words: state.widgetData.keyWords.data,
  // isFetching: state.widgetData.keyWords.isFetching,
  id: state.currentlySelectedBusiness.businessId,
  businessInfo: state.currentlySelectedBusiness,
  businesses: state.userBusinesses.businesses.concat(
    state.competitors.businesses
  ),
  userBusinesses: state.userBusinesses.businesses,
  competitors: state.competitors.businesses
});

export default connect(mapStateToProps, {
  fetchWordsOverTime,
  fetchTopAndBottom,
  fetchAllData
})(DashboardGrid);
