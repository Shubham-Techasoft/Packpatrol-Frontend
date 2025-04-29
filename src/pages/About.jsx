// // import React from "react";
// // import { Helmet } from "react-helmet";
// // import "bootstrap/dist/css/bootstrap.min.css";
// // import "@fortawesome/fontawesome-free/css/all.css";
// // import "animate.css/animate.min.css";
// // import "owl.carousel/dist/assets/owl.carousel.min.css";
// // import "owl.carousel/dist/assets/owl.theme.default.min.css";
// // import "swiper/css/swiper-bundle.min.css";
// // import "bootstrap-select/dist/css/bootstrap-select.min.css";
// // import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
// // import "daterangepicker/daterangepicker.css";
// // import "aos/dist/aos.css";
// // import "./assets/css/style_home.css";
// // import "./assets/css/style_web.css";
// // import "./assets/css/theme.min.css";
// // import "./assets/css/style_ie.css";
// // import "./assets/css/custom.css"; // You might need a custom CSS file

// // function About() {
// //   return (
// //     <>
// //       <Helmet>
// //         <title>AI ML Development Company In Bangalore | AI ML Services</title>
// //         <meta charset="utf-8" />
// //         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
// //         <meta name="author" content="AI/ML Consulting Techasoft" />
// //         <meta
// //           name="description"
// //           content="With our AI & Machine Learning development and consulting services, you can automate your internal processes and redefine how customers interact with your product."
// //         />
// //         <meta
// //           property="og:title"
// //           content="AI ML Development Company In Bangalore | AI ML Services"
// //         />
// //         <meta
// //           property="og:description"
// //           content="With our AI & Machine Learning development and consulting services, you can automate your internal processes and redefine how customers interact with your product."
// //         />
// //         <meta property="og:type" content="website" />
// //         <meta property="og:url" content="https://ml.techasoft.com/blogs" />
// //         <meta
// //           property="og:image"
// //           content="https://ml.techasoft.com/debug/assets/images/logo.png"
// //         />
// //         <meta name="twitter:card" content="summary_large_image" />
// //         <meta
// //           name="twitter:description"
// //           content="With our AI & Machine Learning development and consulting services, you can automate your internal processes and redefine how customers interact with your product."
// //         />
// //         <meta
// //           name="twitter:title"
// //           content="AI ML Development Company In Bangalore | AI ML Services"
// //         />
// //         <meta name="twitter:site" content="@TECHASOFT_BNGLR" />
// //         <meta
// //           name="twitter:image"
// //           content="https://ml.techasoft.com/debug/assets/images/logo.png"
// //         />
// //         <link rel="canonical" href="https://ml.techasoft.com/" />
// //         <meta http-equiv="X-UA-Compatible" content="IE=edge" />
// //         <link
// //           rel="apple-touch-icon"
// //           sizes="180x180"
// //           href="https://ml.techasoft.com/debug/assets/images/TS-Logo-LArge-1.ico"
// //         />
// //         <link
// //           rel="icon"
// //           type="image/ico"
// //           sizes="32x32"
// //           href="https://ml.techasoft.com/debug/assets/images/TS-Logo-LArge-1.ico"
// //         />
// //         <link
// //           rel="icon"
// //           type="image/ico"
// //           sizes="16x16"
// //           href="https://ml.techasoft.com/debug/assets/images/TS-Logo-LArge-1.ico"
// //         />
// //         <link
// //           rel="manifest"
// //           href="https://ml.techasoft.com/debug/assets/images/site.webmanifest"
// //         />
// //         <meta name="msapplication-TileColor" content="#da532c" />
// //         <meta name="theme-color" content="#ffffff" />
// //         <link
// //           href="https://ml.techasoft.com/debug/assets/css/bootstrap.min.css"
// //           rel="stylesheet"
// //           type="text/css"
// //         />
// //         <link
// //           href="https://ml.techasoft.com/debug/assets/font-awesome/css/all.css"
// //           rel="stylesheet"
// //           type="text/css"
// //         />
// //         <link
// //           href="https://ml.techasoft.com/debug/assets/css/style_home.css"
// //           rel="stylesheet"
// //           type="text/css"
// //         />
// //         <link
// //           href="https://ml.techasoft.com/debug/assets/css/style_web.css"
// //           rel="stylesheet"
// //           type="text/css"
// //         />
// //         <link
// //           href="https://ml.techasoft.com/debug/assets/css/animate.css"
// //           rel="stylesheet"
// //           type="text/css"
// //         />
// //         <link
// //           href="https://ml.techasoft.com/debug/assets/css/style_ie.css"
// //           rel="stylesheet"
// //           type="text/css"
// //         />
// //         <link
// //           rel="stylesheet"
// //           href="https://ml.techasoft.com/debug/assets/css/owl.carousel.min.css"
// //         />
// //         <link
// //           rel="stylesheet"
// //           href="https://ml.techasoft.com/debug/assets/css/owl.theme.default.min.css"
// //         />
// //         <link
// //           href="https://ml.techasoft.com/debug/assets/css/theme.min.css"
// //           rel="stylesheet"
// //         />
// //         {/* Link Swiper's CSS */}
// //         <link
// //           rel="stylesheet"
// //           href="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css"
// //         />
// //         <link
// //           rel="stylesheet"
// //           href="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/css/bootstrap-select.min.css"
// //         />
// //         <link
// //           rel="stylesheet"
// //           href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
// //         />
// //         <link
// //           rel="stylesheet"
// //           href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
// //         />
// //         {/* date range picker-- */}
// //         <link
// //           rel="stylesheet"
// //           href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css"
// //           integrity="sha512-mSYUmp1HYZDFaVKK//63EcZq4iFWFjxSL+Z3T/aCt4IO9Cejm03q3NKKYN6pFQzY0SBOr8h+eCIAZHPXcpZaNw=="
// //           crossorigin="anonymous"
// //         />
// //         <link
// //           rel="stylesheet"
// //           type="text/css"
// //           href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css"
// //         />
// //         {/* ------AOS------- */}
// //         <link
// //           href="https://unpkg.com/aos@2.3.1/dist/aos.css"
// //           rel="stylesheet"
// //         />
// //         {/* -----fonts----- */}
// //         <link rel="preconnect" href="https://fonts.googleapis.com" />
// //         <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
// //         <link
// //           href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Open+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600;1,700;1,800&family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&family=Urbanist:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500&display=swap"
// //           rel="stylesheet"
// //         />
// //         {/* Google tag (gtag.js) */}
// //         <script
// //           async
// //           src="https://www.googletagmanager.com/gtag/js?id=G-8Y80TPVRSG"
// //         ></script>
// //         <script>
// //           {`
// //             window.dataLayer = window.dataLayer || [];
// //             function gtag(){dataLayer.push(arguments);}
// //             gtag('js', new Date());
// //             gtag('config', 'G-8Y80TPVRSG');
// //           `}
// //         </script>
// //         <meta
// //           name="google-site-verification"
// //           content="Ltyuylp7aaKDSKpFLdoAd8HrkunpI9gyc_FVap4qxLo"
// //         />
// //       </Helmet>
// //       <div id="snackbar"></div>
// //       <div id="snackbar_error"></div>
// //       <div id="loader-body" style={{ display: "none" }}>
// //         <div className="sk-circle">
// //           <div className="sk-circle1 sk-child"></div>
// //           <div className="sk-circle2 sk-child"></div>
// //           <div className="sk-circle3 sk-child"></div>
// //           <div className="sk-circle4 sk-child"></div>
// //           <div className="sk-circle5 sk-child"></div>
// //           <div className="sk-circle6 sk-child"></div>
// //           <div className="sk-circle7 sk-child"></div>
// //           <div className="sk-circle8 sk-child"></div>
// //           <div className="sk-circle9 sk-child"></div>
// //           <div className="sk-circle10 sk-child"></div>
// //           <div className="sk-circle11 sk-child"></div>
// //           <div className="sk-circle12 sk-child"></div>
// //         </div>
// //       </div>
// //       <div id="wrap">
// //         <div id="main" className="container-fluid clear-top px-0">
// //           {/* ----Navbar--- */}
// //           <section id="top__header" className="topheader">
// //             <header id="header">
// //               <div className="container-fluid pl-md-0 pr-md-5">
// //                 <nav className="navbar navbar-expand-md px-md-0 py-nav py-0">
// //                   <a
// //                     className="navbar-brand font-weight-bold"
// //                     href="https://ml.techasoft.com/"
// //                   >
// //                     <img
// //                       src="https://ml.techasoft.com/debug/assets/images/logo.svg"
// //                       className="animate__jello animate__animated"
// //                       alt="logo"
// //                     />
// //                   </a>
// //                   <button
// //                     className="d-md-none d-block toggler-button"
// //                     id="sidebarCollapse"
// //                     type="button"
// //                   >
// //                     <div className="bar-parents">
// //                       <div className="bar1"></div>
// //                       <div className="bar2"></div>
// //                       <div className="bar3"></div>
// //                     </div>
// //                   </button>
// //                   {/* -closing menu by side click */}
// //                   <div
// //                     className="d-xl-none d-block"
// //                     id="side-click-close"
// //                   ></div>
// //                   <div
// //                     className="collapse navbar-collapse mobile-nav"
// //                     id="navbarNav"
// //                   >
// //                     <div className="mobile-logo d-none mx-auto">
// //                       <a className="" href="https://ml.techasoft.com/">
// //                         <img
// //                           src="https://ml.techasoft.com/debug/assets/images/logo.png"
// //                           className="my-3 d-xl-none d-block mx-auto"
// //                           width="80"
// //                           height="auto"
// //                           alt="logo"
// //                         />
// //                       </a>
// //                     </div>
// //                     <button id="closeMenu" className="d-none">
// //                       <img
// //                         src="https://ml.techasoft.com/debug/assets/images/delete.png"
// //                         width="20"
// //                         alt="close"
// //                       />
// //                     </button>
// //                     <div className="d-none mob-logo">
// //                       <img
// //                         src="https://ml.techasoft.com/debug/assets/images/logo.png"
// //                         alt="logo"
// //                       />
// //                     </div>
// //                     <ul className="navbar-nav navbar-expand-md ml-md-auto main-ul main-ul_left">
// //                       <li className="nav-item active">
// //                         <a
// //                           href="https://ml.techasoft.com/"
// //                           className="nav-link"
// //                         >
// //                           Home
// //                         </a>
// //                       </li>
// //                       <li className="nav-item dropdown">
// //                         <a
// //                           href="https://ml.techasoft.com/#our-services"
// //                           className="nav-link dropdown-toggle"
// //                           data-toggle="dropdown"
// //                           role="button"
// //                           aria-haspopup="true"
// //                           aria-expanded="false"
// //                         >
// //                           Our Services
// //                         </a>
// //                         <div className="dropdown-menu animate slideIn">
// //                           <a
// //                             className="dropdown-item"
// //                             href="https://ml.techasoft.com/services/data-annotation-services"
// //                           >
// //                             Data Annotation
// //                           </a>
// //                           <a
// //                             className="dropdown-item"
// //                             href="https://ml.techasoft.com/services/data-processing-company"
// //                           >
// //                             Data Processing
// //                           </a>
// //                         </div>
// //                       </li>
// //                       {/* <li className="nav-item">
// //                                     <a href="https://ml.techasoft.com/#testimonial" className="nav-link">
// //                                         Testimonial
// //                                      </a>
// //                                 </li> */}
// //                       <li className="nav-item">
// //                         <a
// //                           href="https://ml.techasoft.com/case-studies"
// //                           className="nav-link"
// //                         >
// //                           Case Study
// //                         </a>
// //                       </li>
// //                       <li className="nav-item">
// //                         <a
// //                           href="https://ml.techasoft.com/contact-us"
// //                           className="nav-link"
// //                         >
// //                           Contact Us
// //                         </a>
// //                       </li>
// //                       <li className="nav-item d-md-none d-block">
// //                         <a
// //                           href="https://ml.techasoft.com/contact-us"
// //                           className="nav-link p-0 contact_link"
// //                         >
// //                           Get Started Free
// //                         </a>
// //                       </li>
// //                     </ul>
// //                   </div>
// //                   <div className="d-md-block d-none">
// //                     <ul className="navbar-nav main-ul">
// //                       <li className="nav-item">
// //                         <a
// //                           href="https://ml.techasoft.com/contact-us"
// //                           className="nav-link p-0 contact_link"
// //                         >
// //                           Get Started Free
// //                         </a>
// //                       </li>
// //                     </ul>
// //                   </div>
// //                 </nav>
// //               </div>
// //             </header>
// //           </section>
// //           {/* ---end Navbar-- */}
// //           <script>
// //             {`
// //               window.addEventListener('scroll', function () {
// //                   var topheader = document.querySelector('.topheader');
// //                   var nav_ul = document.querySelector('.main-ul');
// //                   topheader.classList.toggle("active-bg", window.scrollY > 200);
// //                   nav_ul.classList.toggle("text-white", window.scrollY > 200);
// //               });
// //               $(document).ready(function () {
// //                   $('#sidebarCollapse, #closeMenu, #side-click-close').on('click', function () {
// //                       $('#sidebarCollapse, #navbarNav, #closeMenu,  #side-click-close').toggleClass(
// //                           'active');
// //                       $('#overlay_menu').toggleClass('bg-body');
// //                       $('body').toggleClass('stop-scroll');
// //                       $('a[aria-expanded=true]').attr('aria-expanded', 'false');
// //                   });
// //               });
// //             `}
// //           </script>
// //           {/* Logo Background Image */}
// //           <img
// //             src="https://ml.techasoft.com/debug/assets/images/logobg-w.png"
// //             className="logobg logobg_white"
// //             alt="logo Bg"
// //           />
// //           {/* /Logo Background Image */}
// //           <main className="main">
// //             {/*Top section  */}
// //             <section className="top_banner d-flex align-items-md-end">
// //               {/* Hand */}
// //               <img
// //                 src="https://ml.techasoft.com/debug/assets/images/airobot.png"
// //                 className="wow fadeInUp top-case robot-ai"
// //                 alt="robot"
// //               />
// //               {/* / */}
// //               {/* Top Eclipse */}
// //               <img
// //                 src="https://ml.techasoft.com/debug/assets/images/eclipserightcut.png"
// //                 className="eclipse-ai"
// //                 alt="eclipse"
// //               />
// //               {/* / */}
// //               {/* Bottom Eclipse */}
// //               <img
// //                 src="https://ml.techasoft.com/debug/assets/images/eclipsebottomcut.png"
// //                 className="eclipse-bottom-ai"
// //                 alt="eclipse"
// //               />
// //               {/* / */}
// //               <div className="container">
// //                 <div className="row">
// //                   <div className="col-md-12 mt-md-0 mt-4">
// //                     <h1 className="hero-title font-urbansit wow fadeInUp">
// //                       AI ML Development Company
// //                     </h1>
// //                     <p>
// //                       Techasoft’s Way of Enhancing the Future Transforming
// //                       Businesses with Intelligent AI & ML Solutions
// //                     </p>
// //                     <a
// //                       href="https://ml.techasoft.com/contact-us"
// //                       className="btn btn-white-primary wow fadeInUp"
// //                     >
// //                       Get Started{" "}
// //                       <img
// //                         src="https://ml.techasoft.com/debug/assets/images/arrow-up-right.svg"
// //                         alt="arrow"
// //                       />
// //                     </a>
// //                   </div>
// //                 </div>
// //               </div>
// //             </section>
// //             {/*/Top section  */}
// //             {/*About Section */}
// //             <section className="about">
// //               {/* Eclipse */}
// //               <img
// //                 src="https://ml.techasoft.com/debug/assets/images/eclipseabout.png"
// //                 className="eclipseabout-ai"
// //                 alt="eclipse"
// //               />
// //               {/* /Eclipse */}
// //               <div className="container">
// //                 <div className="row">
// //                   <div className="col-md-12 mb-col">
// //                     <h2 className="section-title wow fadeInUp">
// //                       AI and ML Services to Build Modern Digital Experiences
// //                     </h2>
// //                   </div>
// //                   {/* About- Gallery Div */}
// //                   <div className="col-md-6 pr-13">
// //                     <div className="xl-gallery wow fadeInUp">
// //                       <img
// //                         src="https://ml.techasoft.com/debug/assets/images/xlgallery.png"
// //                         alt="xlgallery"
// //                         className="w-100 d-md-block d-none"
// //                       />
// //                       <div className="xl-gallery_top">
// //                         AI-Based Solutions
// //                         <p>
// //                           We offer outstanding AI and ML Services that empower
// //                           businesses with powerful and innovative AI solutions.
// //                           Our team of proficient AI developers excels in
// //                           decision-making and problem-solving, harnessing the
// //                           capabilities of intelligent AI software. By leveraging
// //                           our services, you can accelerate your workflow, reduce
// //                           costs, and eliminate errors. Don't wait any longer –
// //                           hire an AI Developer from our skilled team today.
// //                         </p>
// //                       </div>
// //                       <div className="xl-gallery_bottom">
// //                         <a
// //                           href="https://ml.techasoft.com/contact-us"
// //                           className="btn btn-white"
// //                         >
// //                           Get Started
// //                           <img
// //                             src="https://ml.techasoft.com/debug/assets/images/arrow-up-right.svg"
// //                             alt="arrow"
// //                           />
// //                         </a>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div className="col-md-6 pl-13 pl_md  row mx-0">
// //                     {/* row 2 */}
// //                     <div className="col-md-6 pr-13 pl-0 px_0">
// //                       <div className="sm-gallery wow fadeInUp">
// //                         <div className="d-inline-block page_url col-50 col-50_l">
// //                           <div className="sm-gallery_top d-flex flex-column justify-content-between sm-gallery_top-relative">
// //                             <div className="sm-gallery_top-top">
// //                               Deep Learning represents a highly advanced and
// //                               automated{" "}
// //                               <span className="d-md-inline d-none">
// //                                 iteration of Machine Learning, offering superior
// //                                 capabilities
// //                               </span>
// //                               ...
// //                             </div>
// //                             <div className="sm-gallery_top-bottom font-urbansit">
// //                               <div>Deep</div>
// //                               <div>learning</div>
// //                             </div>
// //                             <img
// //                               src="https://ml.techasoft.com/debug/assets/images/arrow-up-right.svg"
// //                               alt="arrow"
// //                               className="arrow_up"
// //                             />
// //                             <div className="hidden-content hidden-content_one">
// //                               <p>
// //                                 Deep Learning represents a highly advanced and
// //                                 automated iteration of Machine Learning,
// //                                 offering superior capabilities in areas such as
// //                                 forecasting and decision-making. With its
// //                                 profound impact on essential operations, this AI
// //                                 technology brings immense potential for
// //                                 organizations. We leverage the finest practices
// //                                 in Deep Learning to develop robust and scalable
// //                                 solutions that align with your business needs.
// //                               </p>
// //                             </div>
// //                           </div>
// //                         </div>
// //                         <div className="d-inline-block page_url col-50 col-50_r">
// //                           <div className="sm-gallery_bottom d-flex flex-column justify-content-between sm-gallery_top-relative">
// //                             <div className="sm-gallery_bottom-top">
// //                               We specialize in developing customized video and
// //                               image analysis{" "}
// //                               <span className="d-md-inline d-none">
// //                                 tools for computer vision and machine vision
// //                                 systems. Our dedicated team
// //                               </span>
// //                               ...
// //                             </div>
// //                             <div className="sm-gallery_bottom-bottom font-urbansit">
// //                               <div>Computer</div>
// //                               <div>Vision</div>
// //                             </div>
// //                             <img
// //                               src="https://ml.techasoft.com/debug/assets/images/arrow-up-right.svg"
// //                               alt="arrow"
// //                               className="arrow_up arrow_up-30"
// //                             />
// //                             <div className="hidden-content hidden-content_two">
// //                               <p>
// //                                 We specialize in developing customized video and
// //                                 image analysis tools for computer vision and
// //                                 machine vision systems. Our dedicated team
// //                                 utilizes cutting-edge technologies like OpenCV
// //                                 to enhance and optimize existing computer vision
// //                                 algorithms. Additionally, we have the expertise
// //                                 to create new algorithms based on robust
// //                                 mathematical models. With our tailored
// //                                 solutions, you can unlock the full potential of
// //                                 computer vision and machine vision, enabling
// //                                 advanced image and video analysis for various
// //                                 applications.
// //                               </p>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                     {/* row 2 */}
// //                     {/* Row 1 */}
// //                     <div className="col-md-6 pr-13 pl-13 px_0">
// //                       <div className="sm-gallery wow fadeInUp">
// //                         <div className="d-inline-block h-100 page_url">
// //                           <div className="sm-gallery_top sm-gallery_top-long d-flex flex-column justify-content-between sm-gallery_top-relative">
// //                             <div className="sm-gallery_top-top">
// //                               We deliver exceptional Natural Language Processing
// //                               (NLP) services using state-of-the-art AI tools.
// //                               Our expertise enables us to extract, process,
// //                               analyze, and comprehend structured data,
// //                               uncovering valuable insights. Through NLP, we
// //                               empower you to train...
// //                             </div>
// //                             <div className="sm-gallery_top-bottom font-urbansit">
// //                               Natural Language Processing
// //                             </div>
// //                             <img
// //                               src="https://ml.techasoft.com/debug/assets/images/arrow-up-right.svg"
// //                               alt="arrow"
// //                               className="arrow_up"
// //                             />
// //                             <div className="hidden-content hidden-content_three">
// //                               <p>
// //                                 We deliver exceptional Natural Language
// //                                 Processing (NLP) services using state-of-the-art
// //                                 AI tools. Our expertise enables us to extract,
// //                                 process, analyze, and comprehend structured
// //                                 data, uncovering valuable insights. Through NLP,
// //                                 we empower you to train chatbots, enhance
// //                                 business intelligence, enable advanced
// //                                 analytics, and much more. With our top-notch
// //                                 quality solutions, you can harness the power of
// //                                 NLP to derive meaningful information and gain a
// //                                 competitive edge in your industry.
// //                               </p>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                     {/* /Row 1 */}
// //                   </div>
// //                   {/* /About- Gallery Div */}
// //                 </div>
// //               </div>
// //             </section>
// //             {/*/About Section */}
// //             {/* Connected Partner */}
// //             <section className="connected">
// //               <div className="container">
// //                 <div className="row connected-client">
// //                   <div className="col-md-2 col-6">
// //                     <img
// //                       src="https://ml.techasoft.com/debug/assets/images/Britannia1.svg"
// //                       alt="Britannia1"
// //                       className="wow fadeInUp"
// //                     />
// //                   </div>
// //                   <div className="col-md-2 col-6">
// //                     <img
// //                       src="https://ml.techasoft.com/debug/assets/images/Exclude.svg"
// //                       alt="Exclude"
// //                       className="wow fadeInUp"
// //                     />
// //                   </div>
// //                   <div className="col-md-2 col-6">
// //                     <img
// //                       src="https://ml.techasoft.com/debug/assets/images/amazon.svg"
// //                       alt="amazon"
// //                       className="wow fadeInUp"
// //                     />
// //                   </div>
// //                   <div className="col-md-2 col-6">
// //                     <img
// //                       src="https://ml.techasoft.com/debug/assets/images/bitcoin.svg"
// //                       alt="bitcoin"
// //                       className="wow fadeInUp"
// //                     />
// //                   </div>
// //                   <div className="col-md-2 col-6">
// //                     <img
// //                       src="https://ml.techasoft.com/debug/assets/images/hubs.svg"
// //                       className="wow fadeInUp"
// //                       alt="hubs"
// //                     />
// //                   </div>
// //                   <div className="col-md-2 col-6">
// //                     <img
// //                       src="https://ml.techasoft.com/debug/assets/images/stripe.svg"
// //                       alt="stripe"
// //                       className="wow fadeInUp"
// //                     />
// //                   </div>
// //                 </div>
// //               </div>
// //             </section>
// //             {/*/ Connected Partner */}
// //             {/* Our Services */}
// //             <section className="our-service" id="our-services">
// //               <div className="container">
// //                 <div className="row">
// //                   <div className="col-md-12 text-center">
// //                     <h2 className="section-title wow fadeInUp">
// //                       Artificial Intelligence and Machine Learning Development
// //                       Services
// //                     </h2>
// //                     <p className="service-para">
// //                       The utilization of AI and ML solutions has become integral
// //                       to numerous business processes and applications.
// //                       Enterprises are increasingly recognizing the value of
// //                       these technologies in enhancing customer experiences and
// //                       driving cost reductions through automation. By leveraging
// //                       AI and ML, organizations can simplify complexities and
// //                       tackle various business challenges by analyzing their
// //                       corporate data.
// //                     </p>
// //                     <p className="service-para">
// //                       As a reputable provider of AI and ML services, we
// //                       specialize in helping enterprises optimize their processes
// //                       and unlock the potential of AI-powered solutions. Our
// //                       tailored AI and ML solutions cater to a diverse range of
// //                       industries, including fintech, healthcare, eCommerce,
// //                       retail, and more. We deliver innovative AI solutions that
// //                       align with specific business requirements and market
// //                       trends.
// //                     </p>
// //                     <p className="service-para">
// //                       Our esteemed corporate clients can benefit from our
// //                       human-centered, outcome-oriented, and advanced AI and ML
// //                       services, enabling them to stay competitive, automate
// //                       processes, and transform their business models. We assist
// //                       our clients in remaining relevant to evolving customer
// //                       needs and seizing limitless growth opportunities.
// //                     </p>
// //                   </div>
// //                 </div>
// //                 <div className="row mt-row">
// //                   <div className="col-md-4">
// //                     <div className="card service_card border-0 wow fadeInUp">
// //                       <div className="service_icon">
// //                         <img
// //                           src="https://ml.techasoft.com/debug/assets/images/robot.svg"
// //                           alt="robo"
// //                         />
// //                       </div>
// //                       <div className="service_title">
// //                         <p className="font-urbansit">
// //                           Artificial Intelligence and Automation
// //                         </p>
// //                       </div>
// //                       <div className="service-body">
// //                         <p className="font-open">
// //                           AI that building the machines like human and
// //                           performing tasks
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div className="col-md-4">
// //                     <div className="card service_card border-0 wow fadeInUp">
// //                       <div className="service_icon">
// //                         <img
// //                           src="https://ml.techasoft.com/debug/assets/images/cloud.svg"
// //                           alt="robo"
// //                         />
// //                       </div>
// //                       <div className="service_title">
// //                         <p className="font-urbansit">Data Analysis</p>
// //                       </div>
// //                       <div className="service-body">
// //                         <p className="font-open">
// //                           Data analytics that helps you to make better decisions
// //                           for financial growth
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div className="col-md-4">
// //                     <div className="card service_card border-0 wow fadeInUp">
// //                       <div className="service_icon">
// //                         <img
// //                           src="https://ml.techasoft.com/debug/assets/images/web-coding.svg"
// //                           alt="robo"
// //                         />
// //                       </div>
// //                       <div className="service_title">
// //                         <p className="font-urbansit">Web scraping</p>
// //                       </div>
// //                       <div className="service-body">
// //                         <p className="font-open">
// //                           Web scraping is the better skill for data collection,
// //                           we will provide data for data analysis, Marketing,
// //                           E-Commerce, Real estate and Academic research ,.etc
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div className="col-md-4">
// //                     <div className="card service_card border-0 wow fadeInUp">
// //                       <div className="service_icon">
// //                         <img
// //                           src="https://ml.techasoft.com/debug/assets/images/database.svg"
// //                           alt="robo"
// //                         />
// //                       </div>
// //                       <div className="service_title">
// //                         <p className="font-urbansit">Data labelling</p>
// //                       </div>
// //                       <div className="service-body">
// //                         <p className="font-open">
// //                           We provide quality and accurate labelling to to train
// //                           the ML and AI models
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div className="col-md-4">
// //                     <div className="card service_card border-0 wow fadeInUp">
// //                       <div className="service_icon">
// //                         <img
// //                           src="https://ml.techasoft.com/debug/assets/images/image.svg"
// //                           alt="robo"
// //                         />
// //                       </div>
// //                       <div className="service_title">
// //                         <p className="font-urbansit">Image Processing</p>
// //                       </div>
// //                       <div className="service-body">
// //                         <p className="font-open">
// //                           We provide object detection, make predictions in
// //                           medical field with image processing and working with
// //                           images like editing
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div className="col-md-4">
// //                     <div className="card service_card border-0 wow fadeInUp">
// //                       <div className="service_icon">
// //                         <img
// //                           src="https://ml.techasoft.com/debug/assets/images/shield-2.svg"
// //                           alt="robo"
// //                         />
// //                       </div>
// //                       <div className="service_title">
// //                         <p className="font-urbansit">Machine learning</p>
// //                       </div>
// //                       <div className="service-body">
// //                         <p className="font-open">
// //                           We train ML models using past data and do predictions
// //                           with algorithms
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </section>
// //             {/* /Our Services */}
// //             {/* Serve Industries */}
// //             <section className="serv-industries" id="">
// //               {/* ... The rest of your HTML content would go here ... */}
// //             </section>
// //           </main>
// //         </div>
// //       </div>
// //       <script src="https://ml.techasoft.com/debug/assets/js/jquery.min.js"></script>
// //       <script src="https://ml.techasoft.com/debug/assets/js/bootstrap.bundle.min.js"></script>
// //       <script src="https://ml.techasoft.com/debug/assets/js/owl.carousel.min.js"></script>
// //       <script src="https://ml.techasoft.com/debug/assets/js/wow.min.js"></script>
// //       <script>new WOW().init();</script>
// //       {/* Swiper JS */}
// //       <script src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js"></script>
// //       <script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/js/bootstrap-select.min.js"></script>
// //       {/* date range picker */}
// //       <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js"></script>
// //       <script
// //         type="text/javascript"
// //         src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"
// //       ></script>
// //       {/* -----AOS JS------- */}
// //       <script>AOS.init();</script>
// //       {/* Custom script */}
// //       <script src="https://ml.techasoft.com/debug/assets/js/custom.js"></script>
// //     </>
// //   );
// // }

// // export default About;

// import React from "react";
// import { Helmet } from "react-helmet";
// import {
//   Container,
//   Typography,
//   Box,
//   Grid,
//   Button,
//   Card,
//   CardMedia,
//   CardContent,
//   styled,
// } from "@mui/material";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

// // Custom styled components (as defined in the previous response)
// const HeroSection = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(8, 0, 10),
//   backgroundImage:
//     "url(https://ml.techasoft.com/debug/assets/images/eclipsebottomcut.png), url(https://ml.techasoft.com/debug/assets/images/eclipserightcut.png)",
//   backgroundRepeat: "no-repeat, no-repeat",
//   backgroundPosition: "bottom left, top right",
//   backgroundColor: theme.palette.background.default,
//   position: "relative",
//   overflow: "hidden",
// }));

// const RobotImage = styled("img")(({ theme }) => ({
//   position: "absolute",
//   bottom: theme.spacing(2),
//   left: theme.spacing(4),
//   maxWidth: "300px",
//   zIndex: 1,
//   [theme.breakpoints.down("md")]: {
//     maxWidth: "200px",
//     left: theme.spacing(2),
//     bottom: theme.spacing(0),
//   },
// }));

// const SectionTitle = styled(Typography)(({ theme }) => ({
//   fontWeight: 700,
//   marginBottom: theme.spacing(4),
//   textAlign: "center",
//   [theme.breakpoints.down("md")]: {
//     fontSize: "2.5rem",
//   },
// }));

// const ServiceCard = styled(Card)(({ theme }) => ({
//   border: "none",
//   boxShadow: theme.shadows[2],
//   borderRadius: theme.shape.borderRadius,
//   height: "100%",
//   display: "flex",
//   flexDirection: "column",
// }));

// const ServiceIconBox = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(3),
//   textAlign: "center",
// }));

// const ServiceTitle = styled(Typography)(({ theme }) => ({
//   fontWeight: 600,
//   textAlign: "center",
//   marginBottom: theme.spacing(1),
// }));

// const ServiceDescription = styled(Typography)(({ theme }) => ({
//   textAlign: "center",
//   color: theme.palette.text.secondary,
// }));

// const PartnerLogo = styled("img")(({ theme }) => ({
//   maxWidth: "100%",
//   height: "auto",
//   filter: "grayscale(80%) opacity(0.7)",
//   transition: "filter 0.3s ease-in-out",
//   "&:hover": {
//     filter: "none",
//     opacity: 1,
//   },
// }));

// const AboutGallery = styled(Box)(({ theme }) => ({
//   position: "relative",
//   borderRadius: theme.shape.borderRadius,
//   overflow: "hidden",
//   boxShadow: theme.shadows[3],
// }));

// const AboutGalleryImage = styled("img")(({ theme }) => ({
//   width: "100%",
//   display: "block",
// }));

// const AboutGalleryOverlay = styled(Box)(({ theme }) => ({
//   position: "absolute",
//   top: 0,
//   left: 0,
//   width: "100%",
//   height: "100%",
//   backgroundColor: "rgba(0, 0, 0, 0.6)",
//   color: theme.palette.common.white,
//   padding: theme.spacing(3),
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   alignItems: "center",
//   opacity: 0,
//   transition: "opacity 0.3s ease-in-out",
//   "&:hover": {
//     opacity: 1,
//   },
// }));

// function About() {
//   return (
//     <>
//       <Helmet>
//         {/* Meta tags from the original HTML */}
//         <title>AI ML Development Company In Bangalore | AI ML Services</title>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <meta name="author" content="AI/ML Consulting Techasoft" />
//         <meta
//           name="description"
//           content="With our AI & Machine Learning development and consulting services, you can automate your internal processes and redefine how customers interact with your product."
//         />
//         {/* ... other meta tags ... */}
//         <link rel="canonical" href="https://ml.techasoft.com/" />
//         {/* ... other link tags ... */}
//       </Helmet>

//       <HeroSection>
//         <RobotImage
//           src="https://ml.techasoft.com/debug/assets/images/airobot.png"
//           alt="robot"
//         />
//         <Container maxWidth="lg">
//           <Typography
//             variant="h2"
//             component="h1"
//             gutterBottom
//             sx={{ fontWeight: 700, color: "primary.main" }}
//           >
//             AI ML Development Company
//           </Typography>
//           <Typography variant="subtitle1" color="text.secondary" paragraph>
//             Techasoft’s Way of Enhancing the Future Transforming Businesses with
//             Intelligent AI & ML Solutions
//           </Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             endIcon={<ArrowUpwardIcon />}
//             href="https://ml.techasoft.com/contact-us"
//           >
//             Get Started
//           </Button>
//         </Container>
//       </HeroSection>

//       <Container maxWidth="lg" sx={{ py: 8 }}>
//         <SectionTitle variant="h4" component="h2">
//           AI and ML Services to Build Modern Digital Experiences
//         </SectionTitle>
//         <Grid container spacing={4}>
//           <Grid item md={6}>
//             <AboutGallery>
//               <AboutGalleryImage
//                 src="https://ml.techasoft.com/debug/assets/images/xlgallery.png"
//                 alt="AI-Based Solutions"
//               />
//               <AboutGalleryOverlay>
//                 <Typography variant="h6" gutterBottom>
//                   AI-Based Solutions
//                 </Typography>
//                 <Typography variant="body2">
//                   We offer outstanding AI and ML Services that empower
//                   businesses with powerful and innovative AI solutions. Our team
//                   of proficient AI developers excels in decision-making and
//                   problem-solving...
//                 </Typography>
//                 <Button
//                   size="small"
//                   color="primary"
//                   endIcon={<ArrowUpwardIcon />}
//                   sx={{ mt: 2 }}
//                   href="https://ml.techasoft.com/contact-us"
//                 >
//                   Learn More
//                 </Button>
//               </AboutGalleryOverlay>
//             </AboutGallery>
//           </Grid>
//           <Grid item md={6} container spacing={2} direction="column">
//             <Grid item xs={12}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     Deep Learning
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Deep Learning represents a highly advanced and automated
//                     iteration of Machine Learning, offering superior
//                     capabilities...
//                   </Typography>
//                   <Button
//                     size="small"
//                     color="primary"
//                     endIcon={<ArrowUpwardIcon />}
//                     sx={{ mt: 2 }}
//                   >
//                     Read More
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     Computer Vision
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     We specialize in developing customized video and image
//                     analysis tools for computer vision and machine vision
//                     systems...
//                   </Typography>
//                   <Button
//                     size="small"
//                     color="primary"
//                     endIcon={<ArrowUpwardIcon />}
//                     sx={{ mt: 2 }}
//                   >
//                     Read More
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     Natural Language Processing
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     We deliver exceptional Natural Language Processing (NLP)
//                     services using state-of-the-art AI tools...
//                   </Typography>
//                   <Button
//                     size="small"
//                     color="primary"
//                     endIcon={<ArrowUpwardIcon />}
//                     sx={{ mt: 2 }}
//                   >
//                     Read More
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Container>

//       <Box sx={{ py: 6, backgroundColor: "grey.100" }}>
//         <Container maxWidth="lg">
//           <Typography
//             variant="h5"
//             component="h3"
//             gutterBottom
//             textAlign="center"
//           >
//             Connected Partners
//           </Typography>
//           <Grid container spacing={4} justifyContent="center">
//             <Grid item xs={6} md={2} lg={2}>
//               <PartnerLogo
//                 src="https://ml.techasoft.com/debug/assets/images/Britannia1.svg"
//                 alt="Britannia1"
//               />
//             </Grid>
//             <Grid item xs={6} md={2} lg={2}>
//               <PartnerLogo
//                 src="https://ml.techasoft.com/debug/assets/images/Exclude.svg"
//                 alt="Exclude"
//               />
//             </Grid>
//             <Grid item xs={6} md={2} lg={2}>
//               <PartnerLogo
//                 src="https://ml.techasoft.com/debug/assets/images/amazon.svg"
//                 alt="amazon"
//               />
//             </Grid>
//             <Grid item xs={6} md={2} lg={2}>
//               <PartnerLogo
//                 src="https://ml.techasoft.com/debug/assets/images/bitcoin.svg"
//                 alt="bitcoin"
//               />
//             </Grid>
//             <Grid item xs={6} md={2} lg={2}>
//               <PartnerLogo
//                 src="https://ml.techasoft.com/debug/assets/images/hubs.svg"
//                 alt="hubs"
//               />
//             </Grid>
//             <Grid item xs={6} md={2} lg={2}>
//               <PartnerLogo
//                 src="https://ml.techasoft.com/debug/assets/images/stripe.svg"
//                 alt="stripe"
//               />
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       <Container maxWidth="md" sx={{ py: 8 }}>
//         <SectionTitle variant="h4" component="h2">
//           Artificial Intelligence and Machine Learning Development Services
//         </SectionTitle>
//         <Typography variant="body1" paragraph color="text.secondary">
//           The utilization of AI and ML solutions has become integral to numerous
//           business processes and applications. Enterprises are increasingly
//           recognizing the value of these technologies in enhancing customer
//           experiences and driving cost reductions through automation. By
//           leveraging AI and ML, organizations can simplify complexities and
//           tackle various business challenges by analyzing their corporate data.
//         </Typography>
//         <Typography variant="body1" paragraph color="text.secondary">
//           As a reputable provider of AI and ML services, we specialize in
//           helping enterprises optimize their processes and unlock the potential
//           of AI-powered solutions. Our tailored AI and ML solutions cater to a
//           diverse range of industries, including fintech, healthcare, eCommerce,
//           retail, and more. We deliver innovative AI solutions that align with
//           specific business requirements and market trends.
//         </Typography>
//         <Typography variant="body1" paragraph color="text.secondary">
//           Our esteemed corporate clients can benefit from our human-centered,
//           outcome-oriented, and advanced AI and ML services, enabling them to
//           stay competitive, automate processes, and transform their business
//           models. We assist our clients in remaining relevant to evolving
//           customer needs and seizing limitless growth opportunities.
//         </Typography>

//         <Grid container spacing={4} sx={{ mt: 4 }}>
//           <Grid item xs={12} md={4}>
//             <ServiceCard>
//               <ServiceIconBox>
//                 <img
//                   src="https://ml.techasoft.com/debug/assets/images/robot.svg"
//                   alt="Artificial Intelligence and Automation"
//                   style={{ maxWidth: "80px" }}
//                 />
//               </ServiceIconBox>
//               <CardContent>
//                 <ServiceTitle variant="h6">
//                   Artificial Intelligence and Automation
//                 </ServiceTitle>
//                 <ServiceDescription variant="body2">
//                   AI that building the machines like human and performing tasks
//                 </ServiceDescription>
//               </CardContent>
//             </ServiceCard>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <ServiceCard>
//               <ServiceIconBox>
//                 <img
//                   src="https://ml.techasoft.com/debug/assets/images/cloud.svg"
//                   alt="Data Analysis"
//                   style={{ maxWidth: "80px" }}
//                 />
//               </ServiceIconBox>
//               <CardContent>
//                 <ServiceTitle variant="h6">Data Analysis</ServiceTitle>
//                 <ServiceDescription variant="body2">
//                   Data analytics that helps you to make better decisions for
//                   financial growth
//                 </ServiceDescription>
//               </CardContent>
//             </ServiceCard>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <ServiceCard>
//               <ServiceIconBox>
//                 <img
//                   src="https://ml.techasoft.com/debug/assets/images/web-coding.svg"
//                   alt="Web scraping"
//                   style={{ maxWidth: "80px" }}
//                 />
//               </ServiceIconBox>
//               <CardContent>
//                 <ServiceTitle variant="h6">Web scraping</ServiceTitle>
//                 <ServiceDescription variant="body2">
//                   Web scraping is the better skill for data collection, we will
//                   provide data for data analysis, Marketing, E-Commerce, Real
//                   estate and Academic research ,.etc
//                 </ServiceDescription>
//               </CardContent>
//             </ServiceCard>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <ServiceCard>
//               <ServiceIconBox>
//                 <img
//                   src="https://ml.techasoft.com/debug/assets/images/database.svg"
//                   alt="Data labelling"
//                   style={{ maxWidth: "80px" }}
//                 />
//               </ServiceIconBox>
//               <CardContent>
//                 <ServiceTitle variant="h6">Data labelling</ServiceTitle>
//                 <ServiceDescription variant="body2">
//                   We provide quality and accurate labelling to to train the ML
//                   and AI models
//                 </ServiceDescription>
//               </CardContent>
//             </ServiceCard>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <ServiceCard>
//               <ServiceIconBox>
//                 <img
//                   src="https://ml.techasoft.com/debug/assets/images/image.svg"
//                   alt="Image Processing"
//                   style={{ maxWidth: "80px" }}
//                 />
//               </ServiceIconBox>
//               <CardContent>
//                 <ServiceTitle variant="h6">Image Processing</ServiceTitle>
//                 <ServiceDescription variant="body2">
//                   We provide object detection, make predictions in medical field
//                   with image processing and working with images like editing
//                 </ServiceDescription>
//               </CardContent>
//             </ServiceCard>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <ServiceCard>
//               <ServiceIconBox>
//                 <img
//                   src="https://ml.techasoft.com/debug/assets/images/shield-2.svg"
//                   alt="Machine learning"
//                   style={{ maxWidth: "80px" }}
//                 />
//               </ServiceIconBox>
//               <CardContent>
//                 <ServiceTitle variant="h6">Machine learning</ServiceTitle>
//                 <ServiceDescription variant="body2">
//                   We train ML models using past data and do predictions with
//                   algorithms
//                 </ServiceDescription>
//               </CardContent>
//             </ServiceCard>
//           </Grid>
//         </Grid>
//       </Container>

//       <Box sx={{ py: 8 }}>
//         <Container maxWidth="lg">
//           <SectionTitle variant="h4" component="h2">
//             Serve Industries
//           </SectionTitle>
//           <Grid container spacing={4} justifyContent="center">
//             <Grid item xs={12} sm={6} md={4} lg={3}>
//               <Card
//                 sx={{
//                   p: 3,
//                   textAlign: "center",
//                   boxShadow: 2,
//                   borderRadius: 2,
//                 }}
//               >
//                 <Typography variant="h6" gutterBottom>
//                   Fintech
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   AI solutions for financial services, fraud detection, risk
//                   management, etc.
//                 </Typography>
//               </Card>
//             </Grid>
//             <Grid item xs={12} sm={6} md={4} lg={3}>
//               <Card
//                 sx={{
//                   p: 3,
//                   textAlign: "center",
//                   boxShadow: 2,
//                   borderRadius: 2,
//                 }}
//               >
//                 <Typography variant="h6" gutterBottom>
//                   Healthcare
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   AI solutions for medical imaging, diagnostics, patient care,
//                   etc.
//                 </Typography>
//               </Card>
//             </Grid>
//             <Grid item xs={12} sm={6} md={4} lg={3}>
//               <Card
//                 sx={{
//                   p: 3,
//                   textAlign: "center",
//                   boxShadow: 2,
//                   borderRadius: 2,
//                 }}
//               >
//                 <Typography variant="h6" gutterBottom>
//                   eCommerce
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   AI for personalized recommendations, inventory management,
//                   customer service.
//                 </Typography>
//               </Card>
//             </Grid>
//             <Grid item xs={12} sm={6} md={4} lg={3}>
//               <Card
//                 sx={{
//                   p: 3,
//                   textAlign: "center",
//                   boxShadow: 2,
//                   borderRadius: 2,
//                 }}
//               >
//                 <Typography variant="h6" gutterBottom>
//                   Retail
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   AI for supply chain optimization, marketing, and customer
//                   engagement.
//                 </Typography>
//               </Card>
//             </Grid>
//             <Grid item xs={12} sm={6} md={4} lg={3}>
//               <Card
//                 sx={{
//                   p: 3,
//                   textAlign: "center",
//                   boxShadow: 2,
//                   borderRadius: 2,
//                 }}
//               >
//                 <Typography variant="h6" gutterBottom>
//                   Manufacturing
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   AI for predictive maintenance, quality control, and process
//                   automation.
//                 </Typography>
//               </Card>
//             </Grid>
//             <Grid item xs={12} sm={6} md={4} lg={3}>
//               <Card
//                 sx={{
//                   p: 3,
//                   textAlign: "center",
//                   boxShadow: 2,
//                   borderRadius: 2,
//                 }}
//               >
//                 <Typography variant="h6" gutterBottom>
//                   Automotive
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   AI for autonomous driving, in-car experience, and
//                   manufacturing.
//                 </Typography>
//               </Card>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>
//     </>
//   );
// }

// export default About;

import React from "react";

const About = () => {
  return <div>About</div>;
};

export default About;
