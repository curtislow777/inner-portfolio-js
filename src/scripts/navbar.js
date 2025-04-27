import gsap from "gsap";
document.addEventListener("DOMContentLoaded", () => {
  // GSAP Animations for Navbar
  // Initial state - move everything up and fade out
  gsap.set(".nav-container", {
    opacity: 0,
    y: -20,
  });

  gsap.set(".nav-item", {
    opacity: 0,
    y: -30,
  });

  gsap.set("#nav-logo", {
    opacity: 0,
    y: -10,
  });

  // Create timeline for entrance animation
  const navTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Animate navbar container first
  navTimeline.to(".nav-container", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power2.out",
  });

  // Then animate the logo with a simple fade in
  navTimeline.to(
    "#nav-logo",
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    },
    "-=0.4"
  );

  // Finally animate nav items with staggered entrance
  navTimeline.to(
    ".nav-item",
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1, // Each item appears 0.1s after the previous one
      ease: "power2.out",
    },
    "-=0.3"
  );

  // Add hover animations for nav items only
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      gsap.to(item, {
        scale: 1.1,
        color: "var(--button-hover)",
        duration: 0.3,
        ease: "power1.out",
      });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        scale: 1,
        color: "#0d1b2a",
        duration: 0.3,
        ease: "power1.in",
      });
    });
  });

  // Simple subtle hover for logo - just a slight scale up, no rotation
  const logo = document.querySelector("#nav-logo");

  logo.addEventListener("mouseenter", () => {
    gsap.to(logo.querySelector(".logo-container"), {
      boxShadow: "0 0 12px rgba(100, 172, 255, 0.5)",
      duration: 0.3,
    });
  });

  logo.addEventListener("mouseleave", () => {
    gsap.to(logo.querySelector(".logo-container"), {
      boxShadow: "none",
      duration: 0.3,
    });
  });
});
