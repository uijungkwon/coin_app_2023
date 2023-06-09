import { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  useLocation,
  useParams,
  useRouteMatch,
  useHistory,
} from 'react-router';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { isDarkAtom } from '../atoms';
import { Link } from 'react-router-dom';
import Price from './Price';
import Chart from './Chart';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { fetchCoinInfo } from '../api';
import { fetchCoinTickers } from '../api';
import { Helmet } from 'react-helmet';

//coin Detail 화면
export const Navigation = styled.div`
  display: flex;
  flex-direction: column;
  background-color: skyblue;
  position: fixed;
  top: 10px;
  left: 10px;
  justify-content: space-between;
  padding: 8px 15px;
  border-radius: 50px;
`;
export const NavIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.cardBgColor};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  &:hover {
    cursor: pointer;
  }
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;
const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BtnToHome = styled.button`
  background-color: transparent;
  border: none;
  color: ${(props) => props.theme.grayText};
`;
const Icon = styled.div`
  font-size: 1em;
`;
const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;
interface RouteParams {
  coinId: string;
}
interface RouteState {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface tickersData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}
interface ICoinProps {
  isDark: boolean;
}

function Coin() {
  //홈 버튼, 다크모드 버튼 만들기
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);

  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();

  const priceMatch = useRouteMatch('/:coinId/price');
  const chartMatch = useRouteMatch('/:coinId/chart');

  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ['info', coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } =
    useQuery<tickersData>(['tickers', coinId], () => fetchCoinTickers(coinId), {
      refetchInterval: 5000,
    }); // 5초마다 refetch하도록 설정 => 실시간 새로고침

  const loading = infoLoading || tickersLoading;

  return (
    //홈 버튼 생성

    <Container>
      <Navigation>
        <NavIcon>
          <Link to={'/'}>HOME</Link>
        </NavIcon>
        {isDark ? (
          <NavIcon onClick={toggleDarkAtom}>LIGHT_MODE</NavIcon>
        ) : (
          <NavIcon onClick={toggleDarkAtom}>DARK_MODE</NavIcon>
        )}
      </Navigation>

      <Helmet>
        <title>
          {state?.name ? state.name : loading ? 'Loading...' : infoData?.name}
        </title>
      </Helmet>

      <Header>
        <Title>
          {state?.name ? state.name : loading ? 'Loading...' : infoData?.name}
        </Title>
      </Header>

      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>

            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>

            <OverviewItem>
              <span>Price:</span>
              <span>{tickersData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>

          <Description>{infoData?.description}</Description>

          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>

            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>

            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/Price`}>Price</Link>
            </Tab>
          </Tabs>

          <Switch>
            <Route path={`/${coinId}/price`}>
              <Price coinId={coinId} tickersData={tickersData} />
            </Route>
            <Route path={`/${coinId}/chart`}>
              <Chart coinId={coinId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}
export default Coin;
