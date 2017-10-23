import React, {Component,} from 'react';
import './CoinChart.css';

class CoinChart extends Component {
    constructor() {
        super();
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        if(prevProps.BTC !== this.props.BTC){
            this.refs.BTC_Wrap.className = 'changed';
            setTimeout(() => this.refs.BTC_Wrap.className = '', 1600)
        }


        if(prevProps.LTC !== this.props.LTC){
            this.refs.LTC_Wrap.className = 'changed';
            setTimeout(() => this.refs.LTC_Wrap.className = '', 1200)
        }


        if(prevProps.ETH !== this.props.ETH){
            this.refs.ETH_Wrap.className = 'changed';
            setTimeout(() => this.refs.ETH_Wrap.className = '', 1000)
        }

    }

    render() {
        let BTC_diff = 0, ETH_diff = 0, LTC_diff = 0;
        let BTC_Perc = 0, ETH_Perc = 0, LTC_Perc = 0;
        if (!!this.props.BTC_Meta) {
            const open = (1 / parseFloat(this.props.BTC_Meta.open)).toFixed(2);
            BTC_diff = parseFloat(this.props.BTC) - open;
            BTC_Perc = (BTC_diff / ( (BTC_diff < 0) ? parseFloat(this.props.BTC) : open)) * 100;
        }
        if (!!this.props.ETH_Meta) {
            const open = (1 / parseFloat(this.props.ETH_Meta.open)).toFixed(2);
            ETH_diff = parseFloat(this.props.ETH) - open;
            ETH_Perc = (ETH_diff / ( (ETH_diff < 0) ? parseFloat(this.props.ETH) : open)) * 100;
        }
        if (!!this.props.LTC_Meta) {
            const open = (1 / parseFloat(this.props.LTC_Meta.open)).toFixed(2);
            LTC_diff = parseFloat(this.props.LTC) - open;
            LTC_Perc = (LTC_diff / ( (LTC_diff < 0) ? parseFloat(this.props.LTC) : open)) * 100;
        }
        return (
            <div className="chart-container">
                <h4>Chart</h4>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Current Value</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>%24h</th>
                    </tr>
                    </thead>
                    <tbody>

                    <tr ref='BTC_Wrap'>
                        <td>Bitcoin</td>
                        <td>{this.props.BTC ? '$ ' + this.props.BTC : 'Fetching...'}</td>
                        <td>{this.props.BTC_Meta ? '$ ' + (1 / parseFloat(this.props.BTC_Meta.high)).toFixed(2) : 'Fetching...'}</td>
                        <td>{this.props.BTC_Meta ? '$ ' + (1 / parseFloat(this.props.BTC_Meta.low)).toFixed(2) : 'Fetching...'}</td>
                        <td>{!!BTC_Perc ? BTC_Perc.toFixed(2) + "%" : 'Fetching...'}</td>
                    </tr>

                    <tr ref='ETH_Wrap'>
                        <td>Etherium</td>
                        <td>{this.props.ETH ? '$ ' + this.props.ETH : 'Fetching...'}</td>
                        <td>{this.props.ETH_Meta ? '$ ' + (1 / parseFloat(this.props.ETH_Meta.high)).toFixed(2) : 'Fetching...'}</td>
                        <td>{this.props.ETH_Meta ? '$ ' + (1 / parseFloat(this.props.ETH_Meta.low)).toFixed(2) : 'Fetching...'}</td>
                        <td>{!!ETH_Perc ? ETH_Perc.toFixed(2) + "%" : 'Fetching...'}</td>
                    </tr>

                    <tr ref='LTC_Wrap'>
                        <td>LiteCoin</td>
                        <td>{this.props.LTC ? '$ ' + this.props.LTC : 'Fetching...'}</td>
                        <td>{this.props.LTC_Meta ? '$ ' + (1 / parseFloat(this.props.LTC_Meta.high)).toFixed(2) : 'Fetching...'}</td>
                        <td>{this.props.LTC_Meta ? '$ ' + (1 / parseFloat(this.props.LTC_Meta.low)).toFixed(2) : 'Fetching...'}</td>
                        <td>{!!LTC_Perc ?  LTC_Perc.toFixed(2) + "%" : 'Fetching...'}</td>
                    </tr>

                    </tbody>
                </table>
            </div>
        );
    }
}

CoinChart.propTypes = {};
CoinChart.defaultProps = {};

export default CoinChart;
