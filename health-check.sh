#!/bin/bash

# Health check script

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "MedPrec - Health Check"
echo "======================"
echo ""

# Check Docker
if systemctl is-active --quiet docker; then
    echo -e "${GREEN}✓ Docker running${NC}"
else
    echo -e "${RED}✗ Docker not running${NC}"
fi

# Check containers
echo ""
echo "Container Status:"
docker-compose ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}"

# Check disk space
echo ""
echo "Disk Space:"
df -h / | tail -n 1 | awk '{print "  Used: " $3 " / " $2 " (" $5 ")"}'

# Check memory
echo ""
echo "Memory Usage:"
free -h | grep Mem | awk '{print "  Used: " $3 " / " $2}'

# Check URLs
echo ""
echo "URL Health Checks:"

# Landing
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200"; then
    echo -e "  Landing (dev): ${GREEN}✓ OK${NC}"
else
    echo -e "  Landing (dev): ${RED}✗ FAIL${NC}"
fi

# Demo
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8081 | grep -q "200"; then
    echo -e "  Demo (dev): ${GREEN}✓ OK${NC}"
else
    echo -e "  Demo (dev): ${RED}✗ FAIL${NC}"
fi

# SSL expiration (if exists)
if [ -f "ssl/live/medprec.com/cert.pem" ]; then
    echo ""
    echo "SSL Certificate:"
    EXPIRY=$(openssl x509 -enddate -noout -in ssl/live/medprec.com/cert.pem | cut -d= -f2)
    echo "  Expires: $EXPIRY"
fi

echo ""
