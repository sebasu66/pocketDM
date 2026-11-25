# Original synthetic raster assets for atlas editor; NOT final art.
from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path
import random, math, json
root=Path(__file__).resolve().parents[1]/'public'/'atlas'
rng=random.Random(1024)
assets=[]
def save(im,id,name,cat,layer,w):
    p=root/'assets'/cat/(id+'.png')
    p.parent.mkdir(parents=True,exist_ok=True)
    im.save(p,optimize=True)
    assets.append(dict(id=id,name=name,category=cat,layer=layer,src='assets/'+cat+'/'+id+'.png',width=w))
def blank(w=256,h=256):return Image.new('RGBA',(w,h))
def shadow(im,box):
    s=blank(*im.size);ImageDraw.Draw(s).ellipse(box,fill=(30,40,37,85));im.alpha_composite(s.filter(ImageFilter.GaussianBlur(9)))
def ground():
    im=Image.new('RGB',(1024,1024),(158,170,146))
    d=ImageDraw.Draw(im)
    for i in range(1800):
        x,y=rng.randrange(1024),rng.randrange(1024);r=rng.randint(3,42);v=rng.randint(-16,16)
        d.ellipse((x-r,y-r,x+r,y+r),fill=(158+v,170+v,146+v))
    im=im.filter(ImageFilter.GaussianBlur(12))
    d=ImageDraw.Draw(im)
    for i in range(11000):
        x,y=rng.randrange(1024),rng.randrange(1024);v=rng.randint(-9,9)
        d.point((x,y),fill=(158+v,170+v,146+v))
    return im
save(ground(),'cold-meadow','Pradera fría','terrain','ground',1200)
def tree(im,x,y,r):
    d=ImageDraw.Draw(im)
    d.ellipse((x-r*.7,y-r*.45,x+r*1.1,y+r*.95),fill=(41,59,47,100))
    for i in range(5):
        rr=r*(1-i*.14);yy=y+r*.22-i*r*.12
        c=[(48,76,57,255),(61,91,65,255),(75,108,79,255),(93,124,94,255),(133,153,129,255)][i]
        pts=[(x+math.cos(a*math.pi/6)*rr*(.84 if a%2 else 1),yy+math.sin(a*math.pi/6)*rr*(.84 if a%2 else 1)) for a in range(12)]
        d.polygon(pts,fill=c)
    d.line((x-r*.5,y-r*.3,x,y-r*.75,x+r*.4,y-r*.3),fill=(184,198,179,200),width=max(1,int(r*.07)))
for i in range(2):
    im=blank();shadow(im,(45,130,210,216));tree(im,118,115,85-i*10);save(im,'pine-'+str(i+1),'Pino '+str(i+1),'nature','nature',75)
im=blank(360,300)
for x,y,r in sorted([(rng.randint(55,305),rng.randint(50,240),rng.randint(30,55)) for _ in range(18)],key=lambda a:a[1]):tree(im,x,y,r)
save(im,'forest','Bosque de coníferas','nature','nature',270)
im=blank();shadow(im,(30,150,230,218));d=ImageDraw.Draw(im)
for p,c in [([(12,180),(70,49),(110,84),(145,28),(238,193)],(94,110,111)), ([(70,49),(110,84),(80,188),(12,180)],(124,141,140)), ([(145,28),(238,193),(135,151)],(66,87,91)), ([(70,49),(91,88),(70,80),(52,103)],(219,227,216)), ([(145,28),(173,76),(151,68),(135,90),(119,83)],(231,236,226))]:d.polygon(p,fill=c)
save(im,'mountains','Cordillera nevada','nature','nature',240)
im=blank();shadow(im,(32,126,230,208));d=ImageDraw.Draw(im)
d.polygon([(28,147),(58,85),(123,53),(199,85),(221,155),(156,186),(77,181)],fill=(112,123,119));d.polygon([(58,85),(123,53),(156,99),(98,145),(28,147)],fill=(164,175,168));d.line([(123,53),(156,99),(221,155)],fill=(79,93,91),width=5);save(im,'rock','Roca','nature','nature',62)
im=blank(360,240);d=ImageDraw.Draw(im);d.ellipse((20,35,340,213),fill=(83,116,123));d.ellipse((30,42,330,203),fill=(112,153,155));d.ellipse((48,55,312,186),fill=(94,142,150));d.arc((65,65,290,178),180,330,fill=(172,204,201),width=3);save(im,'lake','Lago','water','water',300)
def path(id,name,pts,color,width,cat,layer,w):
    im=blank(256,256);d=ImageDraw.Draw(im);d.line(pts,fill=color[0],width=width+10,joint='curve');d.line(pts,fill=color[1],width=width,joint='curve');d.line(pts,fill=color[2],width=2,joint='curve');save(im,id,name,cat,layer,w)
path('road-straight','Camino recto',[(0,128),(256,128)],[(117,110,87),(182,164,123),(210,194,156)],25,'props','roads',260)
path('road-bend','Curva de camino',[(0,128),(48,128),(95,112),(125,81),(128,0)],[(117,110,87),(182,164,123),(210,194,156)],25,'props','roads',260)
path('river-straight','Río recto',[(0,128),(256,128)],[(101,128,115),(97,145,157),(158,193,194)],48,'water','water',280)
path('river-bend','Curva del río',[(0,128),(48,128),(97,112),(125,76),(128,0)],[(101,128,115),(97,145,157),(158,193,194)],48,'water','water',280)
def building(id,name,roof,shape='house',w=115):
    im=blank();shadow(im,(25,60,238,220));d=ImageDraw.Draw(im)
    if shape=='tower':
        d.ellipse((50,45,206,202),fill=(84,89,81),outline=(52,59,55),width=5);d.ellipse((60,55,196,190),fill=(139,145,132),outline=(187,188,170),width=8);d.ellipse((80,75,176,170),fill=(101,111,104));d.rectangle((116,151,140,199),fill=(63,70,64))
        for a in range(0,360,45):
            x=128+math.cos(math.radians(a))*71;y=123+math.sin(math.radians(a))*71;d.rectangle((x-10,y-10,x+10,y+10),fill=(171,174,155),outline=(88,94,85))
    elif shape=='wall':
        d.rectangle((5,89,250,166),fill=(80,91,85));d.rectangle((5,80,250,142),fill=(148,156,142),outline=(93,102,92),width=4)
        for x in range(8,244,32):d.rectangle((x,70,x+15,92),fill=(183,188,171));d.line((x,99,x,141),fill=(111,123,112),width=2)
    elif shape=='gate':
        d.rectangle((10,76,246,183),fill=(91,99,91));d.rectangle((12,68,75,184),fill=(158,164,148));d.rectangle((181,68,244,184),fill=(158,164,148));d.rectangle((75,108,181,171),fill=(99,75,51));d.line((85,114,172,165),fill=(144,117,77),width=5);d.line((85,165,172,114),fill=(144,117,77),width=5)
    else:
        d.rectangle((35,55,221,208),fill=(93,83,62),outline=(50,58,49),width=4)
        d.polygon([(24,42),(128,15),(232,42),(232,176),(128,199),(24,176)],fill=roof,outline=(61,68,59),width=4)
        d.polygon([(24,42),(128,15),(128,199),(24,176)],fill=tuple(max(0,c-22) for c in roof))
        d.line((128,15,128,199),fill=(184,182,155),width=5)
        for y in range(53,178,19):d.line((29,y,125,y-20),fill=tuple(max(0,c-18) for c in roof),width=2);d.line((131,y-20,226,y),fill=tuple(max(0,c-18) for c in roof),width=2)
        d.rectangle((168,45,190,77),fill=(112,113,99),outline=(70,76,66),width=3)
        d.rectangle((115,199,142,213),fill=(65,60,43))
    save(im,id,name,'buildings','buildings',w)
building('house-a','Casa de madera',(129,108,79))
building('house-b','Casa de pizarra',(113,128,130))
building('warehouse','Almacén',(149,125,85),w=160)
building('tavern','Taberna',(139,95,74),w=150)
building('barracks','Cuartel',(100,119,113),w=145)
building('tower','Torre de piedra',(0,0,0),'tower',110)
building('wall','Muralla',(0,0,0),'wall',220)
building('gate','Portón',(0,0,0),'gate',155)
im=blank();d=ImageDraw.Draw(im);shadow(im,(28,72,231,194));d.rounded_rectangle((20,71,236,185),radius=9,fill=(110,83,52),outline=(64,60,45),width=5)
for x in range(26,230,17):d.line((x,76,x,180),fill=(171,143,93),width=5)
d.line((19,79,237,79),fill=(195,180,140),width=10);d.line((19,178,237,178),fill=(195,180,140),width=10);save(im,'bridge','Puente de madera','props','props',98)
im=blank();d=ImageDraw.Draw(im);d.ellipse((49,49,207,207),fill=(88,97,86),outline=(179,185,166),width=14);d.ellipse((77,77,179,179),fill=(48,68,66));d.rectangle((63,110,193,139),fill=(124,95,59));save(im,'well','Pozo','props','props',65)
# Coastal strip: alpha at the inland edge, reusable for the port settlement and region.
coast=blank(512,1024);d=ImageDraw.Draw(coast)
shore=[(int(310+math.sin(y/120)*25+math.sin(y/39)*10),y) for y in range(0,1025,4)]
poly=[(0,0),*shore,(0,1024)]
d.polygon([(0,0),*[(x+11,y) for x,y in shore],(0,1024)],fill=(157,170,146,255))
d.polygon(poly,fill=(88,124,133,255))
d.polygon([(0,0),*[(x-26,y) for x,y in shore],(0,1024)],fill=(68,110,126,255))
d.line(shore,fill=(212,218,191,255),width=8)
d.line([(x-12,y) for x,y in shore],fill=(143,183,184,255),width=4)
for _ in range(650):
    y=rng.randrange(1024); edge=310+math.sin(y/120)*25+math.sin(y/39)*10;x=rng.randint(0,max(0,int(edge)-35));length=rng.randint(4,28);d.line((x,y,min(x+length,int(edge)-22),y),fill=(93,139,151,rng.randint(50,110)),width=1)
save(coast,'coast-west','Costa y mar','water','water',740)
im=blank(320,160);shadow(im,(15,34,304,147));d=ImageDraw.Draw(im);d.rounded_rectangle((10,35,310,126),radius=4,fill=(122,105,75),outline=(70,78,70),width=4)
for x in range(20,307,16):d.line((x,42,x,120),fill=(190,171,126),width=3)
for x in [24,95,166,237,300]:
    for y in [40,122]:d.ellipse((x-6,y-6,x+6,y+6),fill=(79,77,58),outline=(185,165,114),width=2)
save(im,'pier','Muelle de madera','props','props',200)
(root/'assets'/'manifest.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2),encoding='utf8')
print('Generated',len(assets),'original raster prototype assets')
