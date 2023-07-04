import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";

export default class Controls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.camp = this.experience.world.camp.actualCamp;
    this.camp.children.forEach((child) => {
      if (child.type === "RectAreaLight") {
        this.rectLight = child;
      }
      if (child.type === "RectAreaLight1") {
        this.rectLight1 = child;
      }
    });

    GSAP.registerPlugin(ScrollTrigger);

    document.querySelector(".page").style.overflow = "visible";

    this.setSmoothScroll();

    this.scrollTrigger();
  }

  setupASScroll() {
    // https://github.com/ashthornton/asscroll
    const asscroll = new ASScroll({
      disableRaf: true,
    });

    GSAP.ticker.add(asscroll.update);

    ScrollTrigger.defaults({
      scroller: asscroll.containerElement,
    });

    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
      scrollTop(value) {
        if (arguments.length) {
          asscroll.currentPos = value;
          return;
        }
        return asscroll.currentPos;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      fixedMarkers: true,
    });

    asscroll.on("update", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", asscroll.resize);

    requestAnimationFrame(() => {
      asscroll.enable({
        newScrollElements: document.querySelectorAll(
          ".gsap-marker-start, .gsap-marker-end, [asscroll]"
        ),
      });
    });
    return asscroll;
  }

  setSmoothScroll() {
    this.asscroll = this.setupASScroll();
  }

  scrollTrigger() {
    ScrollTrigger.matchMedia({
      //Desktop
      "(min-width: 969px)": () => {
        this.camp.scale.set(0.8, 0.8, 0.8);

        //FIRST SECTION

        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".first-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        this.firstMoveTimeline.to(this.camp.position, {
          x: () => {
            return this.sizes.width * 0.0015;
          },
        });

        //SECOND SECTION

        this.secondMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".second-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        this.secondMoveTimeline.to(
          this.camp.position,
          {
            x: () => {
              return this.sizes.width * -0.0001; //ako treba vrati na return 1!!!
            },
            z: () => {
              return this.sizes.height * 0.001;
            },
          },
          "same"
        );

        this.secondMoveTimeline.to(
          this.camp.scale,
          {
            x: 1.8,
            y: 1.8,
            z: 1.8,
          },
          "same"
        );

        //THIRD SECTION

        this.thirdMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        this.thirdMoveTimeline.to(this.camera.orthographicCamera.position, {
          x: 1,
          y: 6,
        });
      },

      //Mobile
      "(max-width: 968px)": () => {
        //RESIZE SCENE TO MOBILE

        this.camp.scale.set(0.5, 0.5, 0.5), this.camp.position.set(0, 0, 0);

        //FIRST SECTION

        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".first-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        this.firstMoveTimeline.to(this.camp.scale, {
          x: 0.8,
          y: 0.8,
          z: 0.8,
        });

        //SECOND SECTION

        this.secondMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".second-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        this.secondMoveTimeline.to(
          this.camp.position,
          {
            x: 1.5,
          },
          "same"
        );

        this.secondMoveTimeline.to(
          this.camp.scale,
          {
            x: 1.1,
            y: 1.1,
            z: 1.1,
          },
          "same"
        );

        this.secondMoveTimeline.to(
          this.rectLight,
          {
            width: 0.4 * 1,
            height: 0.4 * 1,
          },
          "same"
        );

        this.secondMoveTimeline.to(
          this.rectLight1,
          {
            width: 0.4 * 1,
            height: 0.4 * 1,
          },
          "same"
        );

        //THIRD SECTION

        this.thirdMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        this.thirdMoveTimeline.to(this.camera.orthographicCamera.position, {
          x: 2,
          y: 6,
        });
      },

      // all
      all: () => {
        this.section = document.querySelectorAll(".section");
        this.section.forEach((section) => {
          this.progressWrapper = section.querySelector(".progress-wrapper");
          this.progressBar = section.querySelector(".progress-bar");

          if (section.classList.contains("right")) {
            GSAP.to(section, {
              borderTopLeftRadius: 20,
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: 0.6,
              },
            });

            GSAP.to(section, {
              borderBottomLeftRadius: 400,
              scrollTrigger: {
                trigger: section,
                start: "bottom bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          } else {
            GSAP.to(section, {
              borderTopRightRadius: 20,
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: 0.6,
              },
            });

            GSAP.to(section, {
              borderBottomRightRadius: 400,
              scrollTrigger: {
                trigger: section,
                start: "bottom bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          }
          GSAP.from(this.progressBar, {
            scaleY: 0,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4,
              pin: this.progressWrapper,
              pinSpacing: false,
            },
          });
        });

        //Mailbox animation Third Section

        this.secondPartTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third-move",
            start: "center center",
          },
        });
        this.camp.children.forEach((child) => {
          if (child.name === "Mailbox") {
            this.first = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.5,
            });
          }
        });
        this.secondPartTimeline.add(this.first);
      },
    });
  }

  resize() {}

  update() {}
}
