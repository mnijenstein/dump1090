<<<<<<< HEAD
#
# When building a package or installing otherwise in the system, make
# sure that the variable PREFIX is defined, e.g. make PREFIX=/usr/local
#
PROGNAME=dump1090

ifdef PREFIX
BINDIR=$(PREFIX)/bin
SHAREDIR=$(PREFIX)/share/$(PROGNAME)
EXTRACFLAGS=-DHTMLPATH=\"$(SHAREDIR)\"
endif

CFLAGS=-O2 -g -Wall -W `pkg-config --cflags librtlsdr`
LIBS=`pkg-config --libs librtlsdr` -lpthread -lm
CC=gcc
=======
CFLAGS?=-O2 -g -Wall -W $(shell pkg-config --cflags librtlsdr)
LDLIBS+=$(shell pkg-config --libs librtlsdr) -lpthread -lm
CC?=gcc
PROGNAME=dump1090
>>>>>>> de61bd564f1aa929bae414a70e421acd0b81789a


all: dump1090 view1090

%.o: %.c
	$(CC) $(CFLAGS) $(EXTRACFLAGS) -c $<

dump1090: dump1090.o anet.o interactive.o mode_ac.o mode_s.o net_io.o
	$(CC) -g -o dump1090 dump1090.o anet.o interactive.o mode_ac.o mode_s.o net_io.o $(LIBS) $(LDFLAGS)

<<<<<<< HEAD
view1090: view1090.o anet.o interactive.o mode_ac.o mode_s.o net_io.o
	$(CC) -g -o view1090 view1090.o anet.o interactive.o mode_ac.o mode_s.o net_io.o $(LIBS) $(LDFLAGS)
=======
dump1090: dump1090.o anet.o
	$(CC) -g -o dump1090 dump1090.o anet.o $(LDFLAGS) $(LDLIBS)
>>>>>>> de61bd564f1aa929bae414a70e421acd0b81789a

clean:
	rm -f *.o dump1090 view1090
