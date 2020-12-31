import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import { Container, Row } from 'react-grid-system';
import { useAppContext } from "../../libs/contextLib";
import { getBooths } from "../../functions/UIStateFunctions.js";

import Loader from "../../components/Loader";
import CardGrid from "../../components/CardGrid";

export default () => {
  const history = useHistory();
  const { globalState, setGlobalState } = useAppContext();
  const [booths, setBooths] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentCard, setCurrentCard] = useState(null);

  const pathName = window.location.pathname.split("/")[2];

  useEffect(() => {
    (async () => {
      const booths = await getBooths(0, globalState);
      setBooths(booths);
    })();

    if (pathName && pathName != "all") {
      setCurrentCard(pathName);
    } else if (!pathName) {
      setCurrentCard(null);
    }
  }, []);

  useEffect(() => {
    if (booths && booths.length > 0) {
      setLoading(false);
    }
  }, [booths, currentCard]);

  useEffect(() => {
    if (!currentCard) return;

    if (currentCard && currentCard.hide === true) {
      setCurrentCard(null);
      history.push("/browse/all");
    } else if (currentCard && currentCard.id) {
      history.push("/browse/" + currentCard.id);
    }
  }, [currentCard]);

  return !loading && booths && booths.length > 0 ? <CardGrid data={booths} globalState={globalState} cardSize="" currentCard={currentCard} setCurrentCard={setCurrentCard} />
  :
    <div>
      <Loader loading={true} />
    </div>
}
