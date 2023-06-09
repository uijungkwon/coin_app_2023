import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchCoinHistory } from '../api';
import { StringLiteral } from 'typescript';
import ReactApexChart from 'react-apexcharts';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from '../atoms';
interface ChartProps {
  coinId: string;
}
interface IHistorical {
  time_open: number;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}
interface ICandleItem {
  x: Date;
  y: number[];
}
function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(
    ['ohlcv', coinId],
    () => fetchCoinHistory(coinId),
    { refetchInterval: 10000 }
  );

  const isDark = useRecoilValue(isDarkAtom);

  return (
    <div>
      {isLoading ? (
        'Loading chart...'
      ) : (
        //그래프 구체화
        <ReactApexChart
          type="candlestick"
          series={[
            {
              name: 'Price',
              data: data?.map((props) => {
                return {
                  x: new Date(props.time_open * 1000), //x축은 날짜를 보여줌 // data type 맞추기!
                  y: [props.open, props.high, props.low, props.close],
                };
              }) as ICandleItem[],
            },
          ]}
          options={{
            theme: {
              mode: isDark ? 'dark' : 'light', //다크모드, 라이트모드 설정 => "isDark" : Atom
            },

            chart: {
              height: 300,
              width: 500,
              toolbar: {
                show: false,
              },
              background: 'transparent',
            },
            grid: { show: false }, //grid 없애기(축)

            yaxis: {
              show: false,
            },

            xaxis: {
              labels: {
                show: false,
              },
            },

            plotOptions: {
              candlestick: {
                colors: {
                  upward: 'lightgreen',
                  downward: 'skyblue',
                },
              },
            },
            tooltip: {
              y: { formatter: (value) => `$ ${value.toFixed(2)}` },
            },
          }}
        />
      )}
    </div>
  );
}
export default Chart;
