import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Coin from './routes/Coin';
import Coins from './routes/Coins';

function Router() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route path="/">
          <Coins />
        </Route>
        <Route path="/:coinId">
          <Coin />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
export default Router;
