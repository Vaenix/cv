import React, { Component } from "react";
import ReactGA from "react-ga";
import $ from "jquery";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import About from "./Components/About";
import Resume from "./Components/Resume";
import Contact from "./Components/Contact";
import Portfolio from "./Components/Portfolio";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foo: "bar",
      resumeData: {},
      dailyTraffic: 0 // 新增状态变量用于存储访问量
    };

    ReactGA.initialize("UA-110570651-1");
    ReactGA.pageview(window.location.pathname);
  }

  // 获取简历数据
  getResumeData() {
    $.ajax({
      url: "./resumeData.json",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ resumeData: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.log(err);
        alert(err);
      }
    });
  }

  // 获取每日访问量
  getDailyTraffic() {
    $.ajax({
      url: "https://mwn-cvaenix.hanshumao.com/", // 替换为后端的实际 API 地址
      data: {
        key: `traffic:${new Date().toISOString().split('T')[0]}` // 按日期获取访问量
      },
      method: "GET",
      success: function (data) {
        this.setState({ dailyTraffic: data.count || 0 }); // 保存访问量到 state
      }.bind(this),
      error: function (xhr, status, err) {
        console.error("获取访问量失败:", err);
      }
    });
  }

  // 页面加载后执行
  componentDidMount() {
    this.getResumeData();
    this.getDailyTraffic();
  }

  render() {
    return (
      <div className="App">
        <Header data={this.state.resumeData.main} />
        <div>
          <h3>今天的访问量：{this.state.dailyTraffic || 0}</h3>
        </div>
        <About data={this.state.resumeData.main} />
        <Resume data={this.state.resumeData.resume} />
        <Portfolio data={this.state.resumeData.portfolio} />
        <Contact data={this.state.resumeData.main} />
        <Footer data={this.state.resumeData.main} />
      </div>
    );
  }
}

export default App;
