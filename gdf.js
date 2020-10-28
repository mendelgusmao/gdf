#!/usr/bin/env node

const crypto = require('crypto');
const Pie = require('cli-pie');
const df = require('@mendelgusmao/df');

const md5 = (s) => crypto.createHash('md5').update(s).digest('hex');
const hex2rgb = (hex) => [...Array(3).keys()].map(
  (i) => parseInt(hex.substring(2 * i, 2 * i + 2), 16),
);

const main = async (args) => {
  const objects = await df(args);

  const pieData = objects.map(
    (object) => {
      if (object.mountpoint === '-') {
        return {
          value: object.available,
          label: 'free',
          color: [255, 255, 255],
        };
      }

      return {
        value: object.used,
        label: object.mountpoint,
        color: hex2rgb(md5(object.mountpoint)),
      };
    },
  );

  const pie = new Pie(10, pieData, {
    legend: true,
  });

  console.log(pie.toString());
};

(
  async () => main(process.argv.slice(2))
)();
