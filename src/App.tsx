import Line from "./components/line";
import Bar from "./components/bar";
import { data } from "./data";

const App = <T,>() => {
  const x_Formatter = (x: string) => {
    const date = new Date(x);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return month + "/" + day;
  };

  const y_Formatter = (y: string) => {
    return parseInt(y.toString()).toFixed(0);
  };

  return (
    <div className="bg-slate-500 h-screen">
      <div className="pt-12">
        <Line
          data={data}
          x_key="date"
          y_key="sales"
          x_Formatter={x_Formatter}
          y_Formatter={y_Formatter}
          margin={55}
          useCurve={true}
          onPressItem={(x: T) => console.log(x)}
        />
      </div>

      <div className="pt-12">
        <Bar
          data={data}
          x_key="date"
          y_key="sales"
          x_Formatter={x_Formatter}
          y_Formatter={y_Formatter}
          margin={50}
          width={900}
        />
      </div>
    </div>
  );
};

export default App;
