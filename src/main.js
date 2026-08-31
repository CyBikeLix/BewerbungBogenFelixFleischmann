import './app.css'
import {
  Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, LogarithmicScale, Filler
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'hammerjs';

ChartJS.register(
  Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, LogarithmicScale, Filler, zoomPlugin
);

import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app
