import React from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  GraduationCap,
  Languages,
  Menu,
  Palette,
  Play,
  Search,
  Star,
  UsersRound,
} from "lucide-react";

const courses = [
  {
    category: "LEARNER FAVOURITE",
    title: "Make maths make sense",
    instructor: "Mrs. Amina Bello",
    rating: "4.9",
    learners: "2,410",
    price: "Free",
    image:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=85",
    label: "MATHS",
    className: "course-art-maths",
  },
  {
    category: "NEW THIS TERM",
    title: "Your first steps in coding",
    instructor: "Daniel Okafor",
    rating: "4.8",
    learners: "1,860",
    price: "Free",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=85",
    label: "DIGITAL SKILLS",
    className: "course-art-code",
  },
  {
    category: "STUDENT PICK",
    title: "Write with confidence",
    instructor: "Joy Eze",
    rating: "4.9",
    learners: "1,205",
    price: "Free",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=85",
    label: "ENGLISH",
    className: "course-art-english",
  },
  {
    category: "CREATIVE CLASS",
    title: "Think in colour: drawing basics",
    instructor: "Chika Nwosu",
    rating: "4.7",
    learners: "984",
    price: "Free",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=85",
    label: "CREATIVITY",
    className: "course-art-creative",
  },
];

const categories = [
  { icon: BookOpen, name: "Study skills", count: "12 courses", color: "blue" },
  { icon: Code2, name: "Digital skills", count: "18 courses", color: "yellow" },
  { icon: Languages, name: "Languages", count: "9 courses", color: "peach" },
  { icon: Palette, name: "Creative arts", count: "14 courses", color: "green" },
];

const HomePageRefresh = () => (
  <main className="learnova">
    <style>{`
      .learnova {
        --blue: #1228a4;
        --blue-dark: #0d1d76;
        --ink: #191d2b;
        --muted: #687080;
        --paper: #fff;
        --wash: #f6f7fb;
        --line: #e7e9ef;
        color: var(--ink);
        background: var(--paper);
        font-family: "DM Sans", "Segoe UI", sans-serif;
      }
      .learnova *, .learnova *::before, .learnova *::after { box-sizing: border-box; }
      .learnova a { color: inherit; text-decoration: none; }
      .learnova-wrap { width: min(1240px, calc(100% - 56px)); margin: 0 auto; }
      .learnova-topline { height: 37px; display: flex; align-items: center; justify-content: center; background: #101e67; color: white; font-size: 11px; letter-spacing: .25px; }
      .learnova-topline strong { margin: 0 4px; color: #ffe78a; }
      .learnova-header { display: flex; align-items: center; gap: 27px; min-height: 76px; border-bottom: 1px solid var(--line); }
      .learnova-brand { display: inline-flex; align-items: center; gap: 8px; flex: 0 0 auto; font-size: 22px; font-weight: 800; letter-spacing: -1px; }
      .learnova-brand-mark { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 9px; background: var(--blue); color: white; }
      .learnova-explore { display: flex; align-items: center; gap: 6px; color: #454b5b; font-size: 13px; font-weight: 650; }
      .learnova-search { display: flex; align-items: center; flex: 1; height: 42px; gap: 10px; padding: 0 14px; border: 1px solid #d6d9e2; border-radius: 999px; color: #7b8291; }
      .learnova-search input { min-width: 0; flex: 1; border: 0; outline: 0; background: transparent; color: var(--ink); font: inherit; font-size: 12px; }
      .learnova-search input::placeholder { color: #9298a4; }
      .learnova-header-links { display: flex; align-items: center; gap: 19px; white-space: nowrap; font-size: 12px; font-weight: 650; }
      .learnova-header-links a:hover { color: var(--blue); }
      .learnova-header-links .login { color: var(--blue); }
      .learnova-header-links .signup { padding: 11px 15px; border-radius: 7px; background: var(--blue); color: white; }
      .learnova-menu { display: none; padding: 6px; border: 0; background: none; color: var(--ink); }
      .learnova-hero { position: relative; display: grid; grid-template-columns: .96fr 1.04fr; min-height: 420px; margin: 29px auto 0; overflow: hidden; border-radius: 9px; background: var(--blue); color: white; }
      .learnova-hero-copy { position: relative; z-index: 2; align-self: center; padding: 45px 20px 48px 53px; }
      .learnova-pill { display: inline-flex; align-items: center; gap: 8px; padding: 7px 11px; border: 1px solid rgba(255,255,255,.28); border-radius: 99px; color: #e5eaff; font-size: 10px; font-weight: 650; }
      .learnova-pill i { width: 6px; height: 6px; border-radius: 50%; background: #ffdf79; }
      .learnova-hero h1 { max-width: 490px; margin: 20px 0 13px; font-size: clamp(40px, 5vw, 62px); line-height: .99; letter-spacing: -3.5px; font-weight: 760; }
      .learnova-hero h1 span { color: #ffe281; }
      .learnova-hero-copy > p { max-width: 400px; margin: 0; color: #dce3ff; font-size: 14px; line-height: 1.75; }
      .learnova-hero-buttons { display: flex; align-items: center; gap: 18px; margin-top: 24px; }
      .learnova-cta { display: inline-flex; min-height: 43px; align-items: center; justify-content: center; gap: 9px; padding: 0 16px; border: 0; border-radius: 6px; background: #ffdf79; color: #20244a !important; font-size: 12px; font-weight: 750; transition: transform .2s ease, background .2s ease; }
      .learnova-cta:hover { transform: translateY(-2px); background: #ffe99d; }
      .learnova-text-link { display: inline-flex; align-items: center; gap: 6px; color: white; font-size: 11px; font-weight: 650; }
      .learnova-hero-art { position: relative; min-height: 390px; overflow: hidden; }
      .learnova-hero-art::before { position: absolute; content: ""; width: 420px; height: 420px; top: 3px; right: -17px; border: 1px solid rgba(255,255,255,.17); border-radius: 50%; box-shadow: 0 0 0 33px rgba(255,255,255,.035), 0 0 0 68px rgba(255,255,255,.03); }
      .learnova-hero-photo { position: absolute; top: 39px; right: 39px; width: 62%; height: 78%; overflow: hidden; border-radius: 48% 48% 9px 9px; transform: rotate(2deg); background: #eacb97; }
      .learnova-hero-photo img { width: 100%; height: 100%; object-fit: cover; object-position: 48% center; }
      .learnova-photo-wash { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(14,28,103,.35), transparent 58%); }
      .learnova-float-note { position: absolute; z-index: 1; display: flex; align-items: center; gap: 10px; padding: 12px 14px; border: 1px solid rgba(25,29,43,.06); border-radius: 8px; background: white; color: var(--ink); box-shadow: 0 12px 32px rgba(8,14,63,.2); }
      .learnova-float-note.one { top: 64px; left: 15px; }
      .learnova-float-note.two { right: 10px; bottom: 40px; }
      .learnova-float-icon { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 7px; background: #fff0bd; color: #7d5a0a; }
      .learnova-float-note.two .learnova-float-icon { background: #e6f0ff; color: var(--blue); }
      .learnova-float-note strong { display: block; font-size: 10px; }
      .learnova-float-note small { display: block; margin-top: 3px; color: #727989; font-size: 8px; }
      .learnova-float-play { position: absolute; top: 46%; left: 44%; display: grid; width: 48px; height: 48px; place-items: center; border-radius: 50%; background: white; color: var(--blue); box-shadow: 0 8px 24px rgba(0,0,0,.16); }
      .learnova-proof { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 0 21px; border-bottom: 1px solid var(--line); color: #747b89; font-size: 11px; }
      .learnova-proof strong { color: var(--ink); font-size: 12px; }
      .learnova-proof-check { display: flex; flex-wrap: wrap; gap: 20px; }
      .learnova-proof-check span { display: inline-flex; align-items: center; gap: 6px; }
      .learnova-proof-check svg { color: var(--blue); }
      .learnova-section { padding: 48px 0; }
      .learnova-section-head { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 22px; }
      .learnova-section-kicker { display: block; margin-bottom: 7px; color: var(--blue); font-size: 9px; font-weight: 800; letter-spacing: 1.45px; text-transform: uppercase; }
      .learnova-section-head h2 { margin: 0; font-size: clamp(24px, 3vw, 33px); letter-spacing: -1.25px; }
      .learnova-section-head p { max-width: 460px; margin: 7px 0 0; color: var(--muted); font-size: 12px; line-height: 1.6; }
      .learnova-all-link { display: inline-flex; align-items: center; gap: 5px; flex: 0 0 auto; color: var(--blue); font-size: 11px; font-weight: 750; }
      .learnova-category-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
      .learnova-category { display: flex; align-items: center; gap: 12px; padding: 15px; border: 1px solid var(--line); border-radius: 8px; background: white; transition: border-color .18s ease, transform .18s ease; }
      .learnova-category:hover { border-color: #a7b5ed; transform: translateY(-2px); }
      .learnova-category-icon { display: grid; width: 40px; height: 40px; flex: 0 0 auto; place-items: center; border-radius: 8px; }
      .learnova-category-icon.blue { background: #e9edff; color: #273fb0; }
      .learnova-category-icon.yellow { background: #fff3d1; color: #876300; }
      .learnova-category-icon.peach { background: #ffede4; color: #a95131; }
      .learnova-category-icon.green { background: #e5f4eb; color: #347750; }
      .learnova-category strong { display: block; font-size: 11px; }
      .learnova-category small { display: block; margin-top: 4px; color: #838997; font-size: 9px; }
      .learnova-courses-section { background: var(--wash); }
      .learnova-course-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 15px; }
      .learnova-course { overflow: hidden; border: 1px solid #e5e7ed; border-radius: 8px; background: white; transition: transform .2s ease, box-shadow .2s ease; }
      .learnova-course:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(30,42,91,.1); }
      .learnova-course-image { position: relative; height: 156px; overflow: hidden; background: #dfe7f5; }
      .learnova-course-image img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s ease; }
      .learnova-course:hover .learnova-course-image img { transform: scale(1.04); }
      .learnova-course-image::after { position: absolute; content: ""; inset: 48% 0 0; background: linear-gradient(transparent, rgba(11,21,57,.38)); }
      .learnova-course-tag { position: absolute; z-index: 1; top: 10px; left: 10px; padding: 6px 7px; border-radius: 3px; background: white; color: #454b5b; font-size: 7px; font-weight: 800; letter-spacing: .65px; }
      .learnova-course-image .course-label { position: absolute; z-index: 1; right: 10px; bottom: 11px; color: white; font-size: 8px; font-weight: 800; letter-spacing: 1px; }
      .learnova-course-body { padding: 13px 13px 14px; }
      .learnova-course h3 { min-height: 38px; margin: 0; font-size: 13px; line-height: 1.45; letter-spacing: -.25px; }
      .learnova-course-instructor { margin-top: 6px; color: #747b89; font-size: 9px; }
      .learnova-course-rating { display: flex; align-items: center; gap: 5px; margin-top: 10px; color: #8a6a09; font-size: 10px; font-weight: 750; }
      .learnova-course-rating svg { fill: #edb332; color: #edb332; }
      .learnova-course-rating small { color: #818794; font-size: 8px; font-weight: 500; }
      .learnova-course-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 11px; padding-top: 10px; border-top: 1px solid #eff0f3; }
      .learnova-course-bottom strong { font-size: 13px; }
      .learnova-course-bottom span { color: #7e8490; font-size: 8px; }
      .learnova-banner { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 28px; overflow: hidden; min-height: 190px; padding: 30px 40px; border-radius: 9px; background: #f0f2ff; }
      .learnova-banner::after { position: absolute; content: ""; width: 180px; height: 180px; top: -80px; right: 19%; border: 1px solid #d1d8ff; border-radius: 50%; box-shadow: 0 0 0 23px #e5e9ff, 0 0 0 47px #eaedff; }
      .learnova-banner-copy { position: relative; z-index: 1; max-width: 510px; }
      .learnova-banner-copy > span { color: var(--blue); font-size: 9px; font-weight: 800; letter-spacing: 1.3px; text-transform: uppercase; }
      .learnova-banner h2 { margin: 8px 0; font-size: clamp(23px, 3vw, 32px); letter-spacing: -1.2px; }
      .learnova-banner p { margin: 0; color: #606a83; font-size: 11px; line-height: 1.7; }
      .learnova-banner .learnova-cta { position: relative; z-index: 1; flex: 0 0 auto; background: var(--blue); color: white !important; }
      .learnova-banner .learnova-cta:hover { background: var(--blue-dark); }
      .learnova-footer { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 24px 0; color: #767c89; font-size: 10px; }
      .learnova-footer .learnova-brand { color: var(--ink); font-size: 17px; }
      .learnova-footer .learnova-brand-mark { width: 29px; height: 29px; border-radius: 8px; }
      .learnova-footer-links { display: flex; flex-wrap: wrap; gap: 18px; }
      .learnova-footer-links a:hover { color: var(--blue); }
      @media (max-width: 980px) {
        .learnova-header { gap: 15px; }
        .learnova-header-links { gap: 12px; }
        .learnova-header-links a:first-child { display: none; }
        .learnova-hero-copy { padding-left: 35px; }
        .learnova-category-grid, .learnova-course-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .learnova-course-image { height: 190px; }
      }
      @media (max-width: 700px) {
        .learnova-wrap { width: min(100% - 32px, 560px); }
        .learnova-topline { padding: 0 10px; text-align: center; font-size: 9px; }
        .learnova-header { min-height: 65px; gap: 11px; }
        .learnova-brand { font-size: 19px; }
        .learnova-brand-mark { width: 31px; height: 31px; }
        .learnova-explore { display: none; }
        .learnova-search { height: 37px; padding: 0 10px; }
        .learnova-search input { font-size: 10px; }
        .learnova-header-links { gap: 10px; font-size: 10px; }
        .learnova-header-links .signup { padding: 9px 10px; }
        .learnova-hero { grid-template-columns: 1fr; margin-top: 18px; }
        .learnova-hero-copy { padding: 34px 25px 20px; }
        .learnova-hero h1 { max-width: 440px; font-size: clamp(41px, 11vw, 57px); }
        .learnova-hero-art { min-height: 260px; }
        .learnova-hero-art::before { width: 310px; height: 310px; right: 12%; top: 0; }
        .learnova-hero-photo { top: 18px; right: 19%; width: 53%; height: 90%; }
        .learnova-float-note.one { top: 36px; left: 8%; }
        .learnova-float-note.two { right: 7%; bottom: 20px; }
        .learnova-proof { align-items: flex-start; flex-direction: column; gap: 10px; padding: 16px 0; font-size: 10px; }
        .learnova-proof-check { gap: 10px 16px; }
        .learnova-section { padding: 37px 0; }
        .learnova-section-head { align-items: flex-start; flex-direction: column; gap: 12px; }
        .learnova-category-grid { gap: 8px; }
        .learnova-category { gap: 8px; padding: 10px; }
        .learnova-category-icon { width: 34px; height: 34px; }
        .learnova-category strong { font-size: 9px; }
        .learnova-category small { font-size: 8px; }
        .learnova-course-grid { gap: 10px; }
        .learnova-course-image { height: 125px; }
        .learnova-course-body { padding: 10px; }
        .learnova-course h3 { min-height: 36px; font-size: 11px; }
        .learnova-course-instructor { font-size: 8px; }
        .learnova-course-rating { gap: 3px; font-size: 9px; }
        .learnova-course-rating small { font-size: 7px; }
        .learnova-banner { align-items: flex-start; flex-direction: column; padding: 26px 22px; }
        .learnova-footer { align-items: flex-start; flex-direction: column; }
      }
      @media (max-width: 390px) {
        .learnova-header { flex-wrap: wrap; padding: 11px 0; }
        .learnova-header-links a.login { display: none; }
        .learnova-search { order: 3; flex-basis: 100%; }
        .learnova-category { align-items: flex-start; flex-direction: column; }
        .learnova-course-image { height: 105px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .learnova *, .learnova *::before, .learnova *::after { transition-duration: .01ms !important; }
      }
    `}</style>

    <div className="learnova-topline">
      A little progress every day adds up. <strong>Find your next lesson.</strong>
    </div>

    <header className="learnova-wrap learnova-header">
      <a className="learnova-brand" href="/" aria-label="Ilearnova home">
        <span className="learnova-brand-mark"><GraduationCap size={20} /></span>
        ilearnova
      </a>
      <a href="#courses" className="learnova-explore">Explore <ChevronRight size={14} /></a>
      <form className="learnova-search" action="#courses" role="search">
        <Search size={16} />
        <input name="q" type="search" placeholder="What would you like to learn?" aria-label="Search courses" />
      </form>
      <nav className="learnova-header-links" aria-label="Main navigation">
        <a href="#courses">Courses</a>
        <a href="#categories">Subjects</a>
        <a href="#teach">Teach</a>
        <a href="/login" className="login">Log in</a>
        <a href="/signup" className="signup">Join free</a>
      </nav>
      <button className="learnova-menu" type="button" aria-label="Open menu"><Menu size={20} /></button>
    </header>

    <section className="learnova-wrap learnova-hero" aria-labelledby="learnova-title">
      <div className="learnova-hero-copy">
        <span className="learnova-pill"><i /> A new term, a new thing to learn</span>
        <h1 id="learnova-title">Curiosity looks good <span>on you.</span></h1>
        <p>
          Pick up a new skill, get curious about a subject, or find a better
          way to tackle your next exam. Your next favourite class is here.
        </p>
        <div className="learnova-hero-buttons">
          <a href="#courses" className="learnova-cta">Find a course <ArrowRight size={15} /></a>
          <a href="#categories" className="learnova-text-link"><Play size={14} /> Browse subjects</a>
        </div>
      </div>
      <div className="learnova-hero-art" aria-label="Learners studying together">
        <div className="learnova-hero-photo">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=90"
            alt="Students learning together around a table"
          />
          <div className="learnova-photo-wash" />
        </div>
        <div className="learnova-float-note one">
          <span className="learnova-float-icon"><BookOpen size={17} /></span>
          <span><strong>Small steps, big ideas</strong><small>Learn at your own pace</small></span>
        </div>
        <div className="learnova-float-play"><Play size={17} fill="currentColor" /></div>
        <div className="learnova-float-note two">
          <span className="learnova-float-icon"><UsersRound size={17} /></span>
          <span><strong>Learn together</strong><small>Made for every kind of learner</small></span>
        </div>
      </div>
    </section>

    <div className="learnova-wrap learnova-proof">
      <strong>A learning space for the whole community</strong>
      <div className="learnova-proof-check">
        <span><Check size={14} /> Short, focused lessons</span>
        <span><Check size={14} /> Learn on your schedule</span>
        <span><Check size={14} /> Made for real classrooms</span>
      </div>
    </div>

    <section className="learnova-wrap learnova-section" id="categories">
      <div className="learnova-section-head">
        <div>
          <span className="learnova-section-kicker">Follow your curiosity</span>
          <h2>Where do you want to begin?</h2>
          <p>Go deep on a subject or try something completely new.</p>
        </div>
        <a className="learnova-all-link" href="#courses">All subjects <ArrowRight size={14} /></a>
      </div>
      <div className="learnova-category-grid">
        {categories.map(({ icon, name, count, color }) => (
          <a className="learnova-category" href="#courses" key={name}>
            <span className={`learnova-category-icon ${color}`}>
              {React.createElement(icon, { size: 19 })}
            </span>
            <span><strong>{name}</strong><small>{count}</small></span>
          </a>
        ))}
      </div>
    </section>

    <section className="learnova-section learnova-courses-section" id="courses">
      <div className="learnova-wrap">
        <div className="learnova-section-head">
          <div>
            <span className="learnova-section-kicker">Picked for your next step</span>
            <h2>Classes learners are loving</h2>
            <p>Good teachers, clear lessons, and something new to take with you.</p>
          </div>
          <a className="learnova-all-link" href="/signup">Explore all courses <ArrowRight size={14} /></a>
        </div>
        <div className="learnova-course-grid">
          {courses.map((course) => (
            <a className="learnova-course" href="/signup" key={course.title}>
              <div className={`learnova-course-image ${course.className}`}>
                <img src={course.image} alt="" loading="lazy" />
                <span className="learnova-course-tag">{course.category}</span>
                <span className="course-label">{course.label}</span>
              </div>
              <div className="learnova-course-body">
                <h3>{course.title}</h3>
                <div className="learnova-course-instructor">{course.instructor}</div>
                <div className="learnova-course-rating">
                  {course.rating} <Star size={11} /> <small>({course.learners} learners)</small>
                </div>
                <div className="learnova-course-bottom"><strong>{course.price}</strong><span>Start learning <ChevronRight size={11} /></span></div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>

    <section className="learnova-wrap learnova-section" id="teach">
      <div className="learnova-banner">
        <div className="learnova-banner-copy">
          <span>Good at something? Pass it on.</span>
          <h2>Great teachers make great learners.</h2>
          <p>Bring your knowledge into the classroom. Create a course, share what you know, and help a learner take their next step.</p>
        </div>
        <a href="/signup" className="learnova-cta">Teach with Ilearnova <ArrowRight size={15} /></a>
      </div>
    </section>

    <footer className="learnova-wrap learnova-footer">
      <a className="learnova-brand" href="/" aria-label="Ilearnova home">
        <span className="learnova-brand-mark"><GraduationCap size={17} /></span>
        ilearnova
      </a>
      <span>For every curious mind.</span>
      <div className="learnova-footer-links">
        <a href="#courses">Courses</a>
        <a href="#categories">Subjects</a>
        <a href="/login">Log in</a>
        <a href="/signup">Join free</a>
      </div>
      <span>© {new Date().getFullYear()} Ilearnova</span>
    </footer>
  </main>
);

export default HomePageRefresh;
