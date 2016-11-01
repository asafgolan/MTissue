import numpy as np
import cv2


import sys



from matplotlib import pyplot as plt

paths =[]
#print "the name of uploaded file"
for line in sys.stdin:
    #print 'PATH -->'
    #print line
    paths.append(line)

#print paths[0]



MIN_MATCH_COUNT = 15


lambi12Counter = 0
lambi8counter = 0
#img1 = cv2.imread('jus1.png',0) # trainImage
#img2 = cv2.imread('real.png',0) # trainImage

'''
    1.check if a model exsits
    2.if it exsits set path to model path
    3.add model to productsDictionariesArray
    4.script will iterate through exsiting models
    5.in view page for all products in db that not been counted notify user ... :-)
'''

'''
productsDictionariesArray = []

import os
for filename in os.listdir('/Users/asafgolan/Documents/MT-API/static/assets/imgs/models'):
     produnctName = filename[:-4]

     productDict = {'title':produnctName, 'path' : '/Users/asafgolan/Documents/MT-API/static/assets/imgs/models'  + filename, 'count':0 }
     print produnctDict['title']

     productDict = {}
     productDict['title'] = filename
     productDict['path']  = '/Users/asafgolan/Documents/MT-API/static/assets/imgs/models'  + filename
     productDict['count'] = 0
     print 'nana na na nanana na hey hey hey maccabi ' + productDict
     productsDictionariesArray.append(productDict);

     dict = {'title': produnctName, 'count': 0, 'path': '/Users/asafgolan/Documents/MT-API/static/assets/imgs/models/'  + filename}

     #print "dict['title']: ", dict['title']
     #print "dict['path']: ", dict['path']
     #print dict
     productsDictionariesArray.append(dict);
 '''


#queryImageArray =['./assets/imgs/lambi12pack.png','./assets/imgs/lambi8pack.png']
productsDictionariesArray = [{'title': 'lambi12pack' , 'path':'/Users/asafgolan/Documents/MT-API/static/assets/imgs/models/lambi12pack.png' , 'count': 0 },{'title': 'lambi8pack' , 'path':'/Users/asafgolan/Documents/pattern/assets/imgs/lambi8pack.png', 'count':0 }]
#productsDictionariesArray = [{'title': 'lambi12pack' , 'path':'' , 'count': 0 },{'title': 'lambi8pack' , 'path':'', 'count':0 }]

'''
for product in productsDictionariesArray :
    for filename in os.listdir('/Users/asafgolan/Documents/MT-API/static/assets/imgs/models'):
        if product['title'] == filename[:-4]
            product['path'] = '/Users/asafgolan/Documents/MT-API/static/assets/imgs/models/' + filename
'''
for product in productsDictionariesArray :

    #print 'Searching product ..'

    #print 'In path ...'
    #print product['path']
    imagePath = product['path']


#for imagePath in queryImageArray :
    img1 = cv2.imread(imagePath,0)

    try:
        img2
    except NameError:
        #print 'final path'
        #url = '/Users/asafgolan/Documents/MT-api/uploads/k-city.jpg'

        url =  paths[0].strip()
        #url =  repr(url)
        #url2 ='./ ' + 'uploads/k-city.jpg'

        #print url
        #print './uploads/k-city.jpg'
        #print "PATHS ARE EQUAL ...."
        #print url == './uploads/k-city.jpg'
        #print type(url)
        img2 = cv2.imread(url,0)
        #img2 = cv2.imread('./uploads/k-city.jpg',0)
        #img2 = cv2.imread('/Users/asafgolan/Documents/pattern/assets/imgs/k-city.jpg',0)
        #print 'lalalalalal --> ...'
        #print fileName
        #print './' + fileName
        #img2 = cv2.imread('./' + fileName,0)


        #img2 = cv2.imread('./uploads/blob')
        #plt.imshow(img2),plt.show()
    else:
        img2
         # queryImage

        #img2 = cv2.imread('k-city.jpg',0) # trainImage


    cv2.ocl.setUseOpenCL(False)
    # Initiate SIFT detector
    surf = cv2.xfeatures2d.SURF_create()
    kp1, des1 = surf.detectAndCompute(img1,None)

    x = 1
    while x == 1:



        # find the keypoints and descriptors with SIFT
        kp1, des1 = surf.detectAndCompute(img1,None)
        kp2, des2 = surf.detectAndCompute(img2,None)
        #print 'Des1',des2
        # flann = cv2.FlannBasedMatcher(index_params,{ })

        bfmatcher = cv2.BFMatcher()
        matches = bfmatcher.knnMatch(des1,des2,k=2)

        # store all the good matches as per Lowe's ratio test.
        good = []
        for m,n in matches:
            if m.distance < 0.7*n.distance:
                good.append(m)

        if len(good)>MIN_MATCH_COUNT:
            #print "good -->" , len(good)
            #lambi12Counter = lambi12Counter + 1
            product['count'] = product['count'] + 1
            src_pts = np.float32([ kp1[m.queryIdx].pt for m in good ]).reshape(-1,1,2)
            dst_pts = np.float32([ kp2[m.trainIdx].pt for m in good ]).reshape(-1,1,2)

            M, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC,5.0)
            matchesMask = mask.ravel().tolist()

            h,w = img1.shape
            pts = np.float32([ [0,0],[0,h-1],[w-1,h-1],[w-1,0] ]).reshape(-1,1,2)
            dst = cv2.perspectiveTransform(pts,M)

            #img2 = cv2.polylines(img2,[np.int32(dst)],True,255,3, cv2.LINE_AA)
            img2 = cv2.fillPoly(img2,[np.int32(dst)],255,8, 0)
            #print 'number of' + product['title'] + 'packs are:' , product['count']

        else:
            #print "Not enough matches are found - %d/%d" % (len(good),MIN_MATCH_COUNT)
            #print 'number of lambi packs are ' , lambi12Counter
            matchesMask = None
            x = 0
            break

        draw_params = dict(matchColor = (0,255,0), # draw matches in green color
                           singlePointColor = None,
                           matchesMask = matchesMask, # draw only inliers
                           flags = 2)


        #print cv2.polylines(img2,[np.int32(dst)],True,255,3, cv2.LINE_AA)
        img3 = cv2.drawMatches(img1,kp1,img2,kp2,good,None,**draw_params)

        #crop_img = img3[92:224, 267:570]

        plt.imshow(img3, 'gray'),plt.show()
        plt.imshow(img2, 'gray'),plt.show()
        #print "============================"



#print 'final product count ...'
#
print productsDictionariesArray
raise SystemExit
