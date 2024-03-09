import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class Camp {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.camp = this.resources.items.camp;
    this.actualCamp = this.camp.scene;

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };

    this.setModel();
    this.onMouseMove();
  }

  setModel() {
    this.actualCamp.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child instanceof THREE.Group) {
        child.children.forEach((groupchild) => {
          groupchild.castShadow = true;
          groupchild.receiveShadow = true;
        });
      }

      if (child.name === "nature_tent_lights_table_bench") {
        child.children[5].material = new THREE.MeshPhysicalMaterial();
        child.children[5].material.roughness = 0;
        child.children[5].material.color.set(0xffff00);
        child.children[5].material.ior = 3;
        child.children[5].material.transmission = 1;
        child.children[5].material.opacity = 1;
      }

      if (child.name === "Mailbox") {
        child.scale.set(0, 0, 0);
      }
    });

    const rectLight = new THREE.RectAreaLight(0xffff00, 1, 0.4, 0.4);
    rectLight.position.set(-0.795923, 0.65, 0.97);
    rectLight.rotation.x = -Math.PI / 2;
    rectLight.rotation.z = Math.PI / 4;

    this.actualCamp.add(rectLight);

    // const rectLightHelper = new RectAreaLightHelper( rectLight );
    // rectLight.add( rectLightHelper );

    const rectLight1 = new THREE.RectAreaLight(0xffff00, 1, 0.4, 0.4);
    rectLight1.position.set(-1.57484, 0.65, 1.4);
    rectLight1.rotation.x = -Math.PI / 2;
    rectLight1.rotation.z = Math.PI / 4;
    this.actualCamp.add(rectLight1);

    // const rectLightHelper = new RectAreaLightHelper( rectLight1 );
    // rectLight1.add( rectLightHelper );

    this.scene.add(this.actualCamp);
    this.actualCamp.scale.set(0.8, 0.8, 0.8);
  }

  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      this.rotation =
        ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
      this.lerp.target = this.rotation * 0.1;
    });
  }

  resize() {}

  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    this.actualCamp.rotation.y = this.lerp.current;
  }
}
