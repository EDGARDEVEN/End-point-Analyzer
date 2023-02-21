#include <stdio.h>
#include <pcap.h>

void process_packet(u_char *args, const struct pcap_pkthdr *header, const u_char *packet);

int main(int argc, char *argv[]) {
    char errbuf[PCAP_ERRBUF_SIZE];
    pcap_t *handle;
    struct bpf_program filter;
    bpf_u_int32 mask;
    bpf_u_int32 net;

    // Get the network interface and its mask
    if (pcap_lookupnet("eth0", &net, &mask, errbuf) == -1) {
        fprintf(stderr, "Error: %s\n", errbuf);
        return 1;
    }

    // Open the network interface for capturing
    handle = pcap_open_live("eth0", BUFSIZ, 1, 1000, errbuf);
    if (handle == NULL) {
        fprintf(stderr, "Error: %s\n", errbuf);
        return 1;
    }

    // Compile the filter expression
    if (pcap_compile(handle, &filter, "tcp and port 80", 0, net) == -1) {
        fprintf(stderr, "Error: %s\n", pcap_geterr(handle));
        return 1;
    }

    // Apply the filter to the network interface
    if (pcap_setfilter(handle, &filter) == -1) {
        fprintf(stderr, "Error: %s\n", pcap_geterr(handle));
        return 1;
    }

    // Capture packets until the user interrupts
    pcap_loop(handle, -1, process_packet, NULL);

    // Close the capture handle
    pcap_close(handle);

    return 0;
}

void process_packet(u_char *args, const struct pcap_pkthdr *header, const u_char *packet) {
    // Extract the IP header
    const struct ip *ip_header = (struct ip*)(packet + sizeof(struct ether_header));

    // Extract the TCP header
    const struct tcphdr *tcp_header = (struct tcphdr*)(packet + sizeof(struct ether_header) + sizeof(struct ip));

    // Check if the packet matches a rule and block it if necessary
    if (is_unwanted_traffic(ip_header, tcp_header)) {
        block_traffic(ip_header, tcp_header);
    }
}
