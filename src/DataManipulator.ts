import { ServerRespond } from './DataStreamer';

export interface Row {
  // stock: string,
  // top_ask_price: number,
  
  // updating it for matching new schema
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]) {
    // Calculate the average price of stock ABC & DEF
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    // Calculate the ratio of priceABC to priceDEF
    const ratio = priceABC / priceDEF;
    // Define upper and lower bounds for the ratio
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
    // return serverResponds.map((el: any) => {
    //   return {
    //     stock: el.stock,
    //     top_ask_price: el.top_ask && el.top_ask.price || 0,
    //     timestamp: el.timestamp,
    //   };
    // })

    // Determine the timestamp for the new row
    const timestamp = serverRespond[0].timestamp > serverRespond[1].timestamp
      ? serverRespond[0].timestamp
      : serverRespond[1].timestamp;

    // Check if the ratio is outside the bounds and set a trigger_alert if necessary
    const trigger_alert = (ratio > upperBound || ratio < lowerBound) ? ratio : undefined;

    // Return the generated row of data
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert,
    };
  }
}
