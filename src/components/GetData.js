import React, {
    Component,
    PropTypes,
} from 'react';

class GetData extends Component {

    constructor(){
        super();
    }

    componentDidMount() {
        this._fetchAndOrganiseRawDataFromCryptoCompare('LTC')
            .then(this._fetchAndOrganiseRawDataFromCryptoCompare('ETH'))
            .then(this._fetchAndOrganiseRawBTCData)
            .then(this._exportData);
    }


    _exportData = () => {
        let exportData = {...this.state.exportData};
        exportData = Object.keys(exportData).map(date => [date, ...exportData[date]]);
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData));
        let dlAnchorElem = this.refs.exportTrigger;
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "scene.json");
        dlAnchorElem.click();
    };
    _fetchAndOrganiseRawBTCData = async () =>
        await fetch('https://www.quandl.com/api/v3/datasets/BCHARTS/BITSTAMPUSD?api_key=JkgTkNVzWduFvt7xTjq6')
            .then(res => res.json()).then(res => {
                let data = res.dataset.data;
                let maxReturn = 0;
                let minReturn = 0;
                let exportData = {...this.state.exportData};
                data.map(dayData => {
                    const open = dayData[1];
                    const close = dayData[4];
                    const diff = close - open;
                    const denominator = (diff < 0) ? close : open;
                    const daysReturn = parseFloat((((close - open) / denominator) * 100).toFixed(2));
                    if (daysReturn === 'NaN')
                        return false;
                    else if (daysReturn > maxReturn)
                        maxReturn = daysReturn;
                    else if (daysReturn < minReturn)
                        minReturn = daysReturn;
                    const timeStamp = dayData[0].split('-').reverse().join('-');
                    console.log(timeStamp);
                    // Export to the masterData
                    if (!!exportData[timeStamp]) {
                        exportData[timeStamp].push(close);
                        console.log('pshed');
                    }
                    return {
                        timeStamp,
                        open, close,
                        return: daysReturn
                    }
                });
                // let returnArray = data.map(dayData => dayData.return);
                console.log({maxReturn, minReturn});
                // this._generateProbability(returnArray, maxReturn, minReturn);
                // const coinData = {...this.state.coinData};
                // coinData['BTC'] = {maxReturn, minReturn};
                // this.setState({coinData});
                // console.log([returnsArray[0], returnsArray[returnsArray.length - 1]]);
                this.setState({exportData});
                // console.log({...data});
                return data;
            });
    _fetchAndOrganiseRawDataFromCryptoCompare = async (coin) =>
        await fetch('https://min-api.cryptocompare.com/data/histoday?fsym=' + coin + '&tsym=USD&limit=459&aggregate=3&e=CCCAGG')
            .then(res => res.json())
            .then(res => res.Data)
            .then(rawData => {
                let exportData = {...this.state.exportData};
                let maxReturn = 0;
                let minReturn = 0;
                const data = rawData.map(dayData => {
                    const {close, open} = dayData;
                    const diff = close - open;
                    const denominator = (diff < 0) ? close : open;
                    let daysReturn = parseFloat((((close - open) / denominator) * 100).toFixed(2));
                    if (isNaN(daysReturn) || daysReturn === 'NaN')
                        daysReturn = 0;
                    else if (daysReturn > maxReturn)
                        maxReturn = daysReturn;
                    else if (daysReturn < minReturn)
                        minReturn = daysReturn;
                    // const time = new Date(dayData.time);
                    // const timeStamp = Date.parse(time) / 1000;
                    // console.log({timeStamp});
                    const timeStamp = moment(dayData.time * 1000).format("DD-MM-YYYY");
                    // Export to the masterData
                    if (!exportData[timeStamp])
                        exportData[timeStamp] = [];
                    exportData[timeStamp].push(close);
                    return {
                        timeStamp,
                        open, close,
                        return: daysReturn
                    }
                });
                // let returnArray = data.map(dayData => dayData.return);
                console.log({...data});
                // this._generateProbability(returnArray, maxReturn, minReturn);
                this.setState({exportData});
                return data;
            });
    render() {
        return null;
    }
}

GetData.propTypes = {};
GetData.defaultProps = {};

export default GetData;
