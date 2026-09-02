"use client";

import { Heading } from "./Heading";

export function Footer() {
  return (
    <footer className="bg-navy text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-2">
          <div>
            <span className="text-xl font-semibold text-white">Dentfix</span>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              We provide modern, reliable dental care focused on comfort and long-term oral health.
            </p>
            <a href="#booking" className="btn-primary mt-6 w-full sm:w-auto">
              Book An Appointment
            </a>
          </div>
          <div>
            <Heading lead="Start Your Smile" accent="Journey Today" light />
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
              Book your appointment today and experience comfortable, expert dental care designed just for you.
            </p>
            <form
              className="mt-6 flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter email address..."
                className="h-12 flex-1 rounded-full border border-white/15 bg-white/5 px-5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-clinic"
                aria-label="Email address"
              />
              <button type="submit" className="press h-12 w-full rounded-full bg-white px-6 text-sm font-semibold text-ink sm:w-auto">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-8 py-10 sm:grid-cols-2 sm:py-12 md:grid-cols-3 lg:grid-cols-5">
          <div>
            <p className="mb-4 text-sm font-semibold text-white">Quick Links</p>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-white" href="#top">Home</a></li>
              <li><a className="hover:text-white" href="#about">About Us</a></li>
              <li><a className="hover:text-white" href="#services">Service</a></li>
              <li><a className="hover:text-white" href="#treatments">Pricing</a></li>
              <li><a className="hover:text-white" href="#booking">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold text-white">Our Services</p>
            <ul className="space-y-2 text-sm">
              <li>Teeth Whitening</li>
              <li>Dental Implants</li>
              <li>Smile Makeover</li>
              <li>Orthodontic Care</li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold text-white">Hours</p>
            <ul className="space-y-2 text-sm">
              <li>Mon–Fri 9:00–5:00</li>
              <li>Sat 9:00–1:00</li>
              <li>Sunday closed</li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold text-white">Contact Info</p>
            <ul className="space-y-2 text-sm">
              <li>hello@dentfix.example</li>
              <li>(555) 014-2000</li>
              <li>180 Harbor Lane, Suite 2</li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold text-white">Follow Us</p>
            <ul className="space-y-2 text-sm">
              <li>Facebook</li>
              <li>Instagram</li>
              <li>LinkedIn</li>
              <li>Twitter X</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:flex-wrap sm:justify-between">
          <p>© {new Date().getFullYear()} Dentfix. All rights reserved.</p>
          <p className="flex gap-4">
            <span>Terms & Conditions</span>
            <span>Privacy Policy</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
