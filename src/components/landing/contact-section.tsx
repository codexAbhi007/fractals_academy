"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { contactData } from "@/lib/contact-data";
import { BackgroundBeams } from "@/components/ui/aceternity";

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: contactData.phone.display,
      href: `tel:${contactData.phone.link}`,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Mail,
      title: "Email",
      value: contactData.email,
      href: `mailto:${contactData.email}`,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: MapPin,
      title: "Location",
      value: contactData.location,
      href: "#",
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: Clock,
      title: "Hours",
      value: contactData.hours,
      href: "#",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <BackgroundBeams />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get in{" "}
            <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our courses? Want to enroll? We&apos;re here to
            help you on your mathematical journey.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Information Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="block"
                >
                  <Card className="border-white/10 bg-white/5 hover:bg-white/8 transition-all group cursor-pointer h-full">
                    <CardContent className="p-4 sm:p-5 flex flex-col items-center text-center h-full justify-center min-h-[140px]">
                      <div
                        className={`p-3 rounded-xl ${info.bgColor} transition-all group-hover:scale-110 mb-3`}
                      >
                        <info.icon
                          className={`h-5 w-5 sm:h-6 sm:w-6 ${info.color}`}
                        />
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                        {info.title}
                      </p>
                      <p className="font-medium text-xs sm:text-sm leading-tight break-words max-w-full">
                        {info.value}
                      </p>
                    </CardContent>
                  </Card>
                </motion.a>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 pt-6"
            >
              <a
                href={`tel:${contactData.phone.link}`}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </Button>
              </a>

              <a
                href={`https://wa.me/${contactData.whatsapp.number}?text=${encodeURIComponent(contactData.whatsapp.message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </Button>
              </a>

              <a
                href={`mailto:${contactData.email}`}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Email Us
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
