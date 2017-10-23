import React, {Component} from 'react';

import CoinChart from './components/CoinChart'
import './App.css';
import sortBy from 'lodash/sortBy'
import last from 'lodash/last'

import {Doughnut, Line} from 'react-chartjs-2';

class App extends Component {

    constructor() {
        super();
        this.state = {
            //['BTC','ETH', 'LTC',]
            weightLR: [0.04, 0.65, 0.31],
            weightHR: [0.12, 0.42, 0.46],
            activeWeight: [0.12, 0.42, 0.46],
            LTC_Meta: null,
            WeekHistLTC: null,
            LTC: null,
            BTC_Meta: null,
            WeekHistBTC: null,
            BTC: null,
            ETH_Meta: null,
            WeekHistETH: null,
            ETH: null,
            DataDates: ['2017-7-1', '2017-7-2', '2017-7-3', '2017-7-4', '2017-7-5', '2017-7-6', '2017-7-7', '2017-7-8', '2017-7-9', '2017-7-10', '2017-7-11', '2017-7-12', '2017-7-13', '2017-7-14', '2017-7-15', '2017-7-16', '2017-7-17', '2017-7-18', '2017-7-19', '2017-7-20', '2017-7-21', '2017-7-22', '2017-7-23', '2017-7-24', '2017-7-25', '2017-7-26', '2017-7-27', '2017-7-28'],
            DEMA: {
                ETH: ['0.44148', '7.28989', '-2.70877', '-2.46046', '-2.63513', '-1.76717', '-2.20926', '2.37203', '-1.87481', '-1.14505', '-1.73750', '15.33139', '-5.78706', '-1.56825', '-4.00620', '-5.84352', '16.11529', '18.87844', '-2.24889', '10.39905', '-4.62135', '2.17285', '-1.42755', '-1.43880', '-1.73634', '-0.32040', '-0.34849', '-0.55948'],
                LTC: ['-2.56721', '6.56243', '5.24538', '14.39124', '-1.26950', '-1.44077', '-1.96789', '7.95525', '-0.89917', '-4.88372', '-4.75422', '3.84406', '-1.23541', '-5.60936', '-1.92670', '-3.39933', '-3.64263', '1.48238', '-1.14925', '9.93343', '-3.42139', '2.17285', '-1.42755', '-1.43880', '-1.73634', '-0.32040', '-0.34849', '-0.55948'],
                BTC: ['-0.75212', '3.66926', '-2.30826', '0.54265', '-1.09512', '-1.46172', '-1.45182', '2.32509', '-0.53306', '-1.81929', '-3.73526', '3.22625', '-0.80842', '-3.29800', '-6.38136', '-3.03234', '16.31289', '3.27566', '-1.58875', '26.81114', '-8.17965', '5.92205', '-2.45362', '-2.62224', '-3.87984', '-1.47008', '5.50135'],
            },
            NOOP: {
                ETH: ['-4.23939', '5.85320', '-2.10934', '-1.92098', '-0.77477', '-0.07371', '-6.68015', '1.49022', '-2.35107', '-10.27474', '-4.35599', '11.70780', '-5.78428', '-2.78023', '-9.96871', '-4.24141', '13.60000', '12.49055', '-9.25915', '9.68230', '-5.87196', '0.89409', '-1.00204', '-0.15148', '-1.93090', '-0.09141', '-0.18300', '-1.03653'],
                LTC: ['-0.88889', '2.40127', '2.81113', '6.61583', '-1.15987', '-2.00235', '-3.25440', '3.42541', '-1.71878', '-2.77124', '-0.40125', '2.09766', '-1.02728', '-1.87655', '-3.23643', '1.96916', '1.04366', '0.82912', '-2.27875', '3.25180', '0.42130', '0.89409', '-1.00204', '-0.15148', '-1.93090', '-0.09141', '-0.18300', '-1.03653'],
                BTC: ['-1.14471', '3.58632', '0.98678', '2.24455', '0.56631', '-0.44681', '-3.82089', '2.26714', '-1.91317', '-6.74931', '-1.03104', '3.15482', '-1.78557', '-4.90656', '-11.11762', '-2.39148', '15.93989', '3.18398', '-1.81506', '25.82101', '-7.15429', '5.90552', '-2.49959', '0.38006', '-6.90988', '-2.64398', '5.36978'],
            },
            Total_DEMA: [],
            Total_NOOP: [],
        }
    }

    componentDidMount() {
        this._fetchAndOrganiseRawDataFromCryptoCompare('BTC')
            .then(data => this.setState({BTC_Meta: last(data), WeekHistBTC: data}));
        this._fetchAndOrganiseRawDataFromCryptoCompare('ETH')
            .then(data => this.setState({ETH_Meta: last(data), WeekHistETH: data}));
        this._fetchAndOrganiseRawDataFromCryptoCompare('LTC')
            .then(data => this.setState({LTC_Meta: last(data), WeekHistLTC: data}));

        setInterval(() => {
            ['BTC', 'ETH', 'LTC'].forEach(coin => {
                this._keepUpdating(coin)
                    .then(data => this.setState({[coin]: data.USD}))

            })
        }, 3000);

        this._calculateDEMAandNOOP(this.state.weightHR);

    }

    _calculateDEMAandNOOP = (weight) => {
        // const weight = this.state.activeWeight;

        const Total_DEMA = this.state.DEMA.ETH.map((v, i) => {
            const DEMA = {...this.state.DEMA};
            return (DEMA.BTC[i] * weight[0]) + (DEMA.ETH[i] * weight[1]) + (DEMA.LTC[i] * weight[2]);
        });
        const Total_NOOP = this.state.NOOP.ETH.map((v, i) => {
            const NOOP = {...this.state.NOOP};
            return (NOOP.BTC[i] * weight[0]) + (NOOP.ETH[i] * weight[1]) + (NOOP.LTC[i] * weight[2]);
        });

        this.setState({Total_DEMA, Total_NOOP});
    };

    _keepUpdating = async (coin) => {
        return fetch('https://min-api.cryptocompare.com/data/price?fsym=' + coin + '&tsyms=USD')
            .then(res => res.json())
    };

    _fetchAndOrganiseRawDataFromCryptoCompare = async (coin) =>
        await fetch('https://min-api.cryptocompare.com/data/histoday?fsym=USD&tsym=' + coin + '&limit=30&aggregate=1&e=CCCAGG')
            .then(res => res.json())
            .then(res => res.Data)
            .then(res => sortBy(res, o => o.time))
            .then(data =>
                data.map(d => {
                    return {...d, time: new Date(d.time * 1000)}
                })
            );

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h2>Cryptosaur</h2>
                </div>
                <div className="container">
                    <CoinChart
                        LTC_Meta={this.state.LTC_Meta}
                        WeekHistLTC={this.state.WeekHistLTC}
                        LTC={this.state.LTC}
                        BTC_Meta={this.state.BTC_Meta}
                        WeekHistBTC={this.state.WeekHistBTC}
                        BTC={this.state.BTC}
                        ETH_Meta={this.state.ETH_Meta}
                        WeekHistETH={this.state.WeekHistETH}
                        ETH={this.state.ETH}
                    />
                    <div className="row chart-bar">
                        <div className="six columns">
                            <div className="weight-chart-container">
                                <Doughnut data={{
                                    datasets: [{
                                        borderColor: '#212121',
                                        borderWidth: '0px',
                                        backgroundColor: ['#FF9900', '#01FF70', 'rgb(33,101,179)'],
                                        data: this.state.activeWeight
                                    }],
                                    labels: ['BTC', 'ETH', 'LTC']
                                }}/>
                            </div>
                        </div>

                        <div className="six columns">
                            <h5>Last Month Returns</h5>
                            <div className="coin-wrap">
                                <div className="return-box">
                                    <h4>4.48%</h4>
                                    <span>Bitcoin</span>
                                </div>
                                <div className="return-box minus">
                                    <h4>-30.50%</h4>
                                    <span>Ethereum</span>
                                </div>
                                <div className="return-box minus">
                                    <h4>-1.59%</h4>
                                    <span>LiteCoin</span>
                                </div>
                            </div>
                            <div className="weight-wrap">
                                <div className="return-box">
                                    <h4>6.085%</h4>
                                    <span>LRPF</span>
                                </div>
                                <div className="return-box">
                                    <h4>8.59%</h4>
                                    <span>HRPF</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <br/>
                    <br/>
                    <br/>
                    <div className="row">
                        <div className="eight columns">
                            <Line
                                data={{
                                    labels: this.state.DataDates,
                                    datasets: [
                                        {
                                            label: 'DEMA',
                                            data: this.state.Total_DEMA,
                                            borderColor: '#7FDBFF'
                                        },
                                        {
                                            label: 'NOOP',
                                            data: this.state.Total_NOOP,
                                            borderColor: '#FF851B'
                                        }
                                    ]
                                }}
                            />
                        </div>
                        <div className="four columns">

                            <div className="weight-btn-wrap">
                                <button
                                    onClick={() => {
                                        this.setState({activeWeight: this.state.weightHR});
                                        this._calculateDEMAandNOOP(this.state.weightHR)
                                    }}
                                    className={(this.state.activeWeight[0] === this.state.weightHR[0]) ? 'active' : ''}
                                >
                                    High Risk Weight
                                </button>
                                <button
                                    onClick={() => {
                                        this.setState({activeWeight: this.state.weightLR});
                                        this._calculateDEMAandNOOP(this.state.weightLR)
                                    }}
                                    className={(this.state.activeWeight[0] === this.state.weightLR[0]) ? 'active' : ''}
                                >
                                    Low Risk Weight
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/*<a onClick={this._exportData}>Export</a>*/}
                {/*<a ref="exportTrigger">q</a>*/}
            </div>
        );
    }
}

export default App;
