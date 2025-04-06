export default function Home() {
    return (
        <div>
          Hello
        </div>
    );
}

// curl ''https://realtime.oxylabs.io/v1/queries'' --user 'praz03_1ioRS:Apple123Apple123=' -H 'Content-Type: application/json' -d '{"source": "amazon_product", "query": "B07FZ8S74R", "geo_location": "90210", "parse": true}'
// curl ''https://realtime.oxylabs.io/v1/queries'' --user 'praz03_1ioRS:Apple123Apple123=' -H 'Content-Type: application/json' -d '{"source": "google_search", "query": "adidas", "geo_location": "California,United States", "parse": true}'